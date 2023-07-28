const router = require('express').Router();
const User = require('../models/User.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { isAuthenticated } = require('../middleware/jwt.middleware');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

const saltRounds = 10;

//Signup - Create a new user
router.post('/signup', async (req, res, next) => {
  const { email, password, name, isCompany } = req.body;

  try {
    //Check if all parameters have been provided
    if (email === '' || password === '' || name === '') {
      return res.status(400).json({ message: 'All fields are mandatory' });
    }

    //Use regex to validate email format

    const emailRegex = /^[^\s@]+@[^\s@]+.[^\s@]{2,}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Provide a valid email adress' });
    }

    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          'Password must have at least 6 characters and contain 1 number, one lowercase and one uppercase letter'
      });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res
        .status(400)
        .json({ message: 'Provided email is already registered' });
    }

    //Encrypt the password
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(password, salt);

    let created;

    created = await User.create({
      email,
      name,
      password: hashedPassword,
      isCompany
    });

    res.json({
      email: created.email,
      name: created.name,
      _id: created._id
    });
  } catch (error) {
    console.log('An error occurred creating the user', error);
    next(error);
  }
});

//Login - Verifies and logs user returning the jwt

router.post('/login', async (req, res, next) => {
  const { email, password } = req.body;

  try {
    if (email === '' || password === '') {
      return res.status(400).json({ message: 'All fields are mandatory' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ message: 'Provided email is not registered' });
    }

    //Check if password is correct
    const isPasswordCorrect = bcrypt.compareSync(password, user.password);

    if (isPasswordCorrect) {
      //create an object that will be set as the JWT payload
      //DONT SEND THE PASSWORD!
      const payload = {
        _id: user._id,
        email: user.email,
        name: user.name
      };

      //Create and sign the JWT. We pass the user payload and the token secret defined in .env

      const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
        algorithm: 'HS256', //Algorithm to encrypt the token, default is HS256
        expiresIn: '6h' //TTL: Time to live of the JWT
      });

      //Send the JWT as response
      res.json({ authToken });
    } else {
      return res.status(400).json({ message: 'Incorrect Password' });
    }
  } catch (error) {
    console.log('An error occurred logging in', error);
    next(error);
  }
});

//Verify -> used to check if the JWT stored on the client is valid

router.get('/verify', isAuthenticated, (req, res, next) => {
  //If the JWT is valid, it gets decoded and made available in req.payload
  console.log('req.payload', req.payload);

  try {
    res.json(req.payload);
  } catch (error) {
    console.log(error);
  }
});
//-----------------------------------------------------------------------

router.use(bodyParser.json());

router.post('/forgot-password', async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const resetToken = jwt.sign({ email }, process.env.TOKEN_SECRET);

    // This will save the reset token and its expiration time to the user's document in the database
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    const emailContent = `
    <h1>Reset Your Password</h1>
    <p>Click the link below to reset your password:</p>
    <a href="${process.env.FRONTEND_RESET_URL}/?token=${resetToken}">Reset Password</a>
  `;

    // Configure the email options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset Request',
      html: emailContent
    };

    // With this the email will be sent
    await transporter.sendMail(mailOptions);

    res.json({ message: 'Password reset email sent successfully' });
  } catch (error) {
    console.error('Error sending reset token', error);
    res.status(500).json({ error: 'Failed to send reset token' });
  }
});

//Now to reset the password:

router.post('/reset-password', async (req, res, next) => {
  const { resetToken, newPassword } = req.body;

  const object = jwt.verify(resetToken, process.env.TOKEN_SECRET);
  const { email } = object;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Checking if the reset token is valid and not expired

    // Reset the user's password
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(newPassword, salt);
    user.password = hashedPassword;

    // Clear the reset token and its expiration time
    user.resetToken = undefined;
    user.resetTokenExpiration = undefined;

    await user.save();

    // Return a success response to the client
    res.json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Error resetting password', error);
    res.status(500).json({ error: 'Failed to reset password' });
  }
});

router.post('/contact-owner', async (req, res) => {
  const { email, userEmail, message } = req.body;
  console.log('Received data:', email, userEmail, message);
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
  const mailOptions = {
    from: email,
    to: userEmail,
    subject: 'Contact request from Holdtheboats.com',
    html: `<h4>Hello!</h4>
     <p>Someone saw your boat ad and wants to contact you! Here you can check the message they sent:</p>
     <p>${message}</p>
     <p>You can contact them back via ${email}</p>
     <p>Thank you!</p>
     <p>Holdtheboats Team.</p>`
  };
  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.log('Error sending email', error);
    res.status(500).json({ message: 'Failed to send email' });
  }
});

module.exports = router;
