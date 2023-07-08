const router = require('express').Router();
const User = require('../models/User.model');
const Company = require('../models/Company.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { isAuthenticated } = require('../middleware/jwt.middleware');

const saltRounds = 10;

//Signup - Create a new user
router.post('/signup', async (req, res, next) => {
  const { email, password, name } = req.body;

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

    const companyExists = await Company.findOne({ email });
    if (companyExists) {
      return res
        .status(400)
        .json({ message: 'Provided email is already registered' });
    }

    //Encrypt the password
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(password, salt);

    //Create the user
    const newUser = await User.create({
      email,
      name,
      password: hashedPassword
    });

    const newCompany = await Company.create({
      email,
      name,
      password: hashedPassword
    });

    res.json({
      email: [newUser.email, newCompany.email],
      name: [newUser.name, newCompany.name],
      _id: [newUser._id, newCompany._id]
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
    const company = await Company.findOne({ email });
    if (!user || !company) {
      return res
        .status(400)
        .json({ message: 'Provided email is not registered' });
    }

    //Check if password is correct
    const isPasswordCorrect = bcrypt.compareSync(password, [
      user.password,
      company.password
    ]);

    if (isPasswordCorrect) {
      //create an object that will be set as the JWT payload
      //DONT SEND THE PASSWORD!
      const payload = {
        _id: [user._id, company._id],
        email: [user.email, company.email],
        name: [user.name, company.name]
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

  res.json(req.payload);
});

module.exports = router;
