const router = require('express').Router();
const Boat = require('../models/Boat.model');
const mongoose = require('mongoose');
const fileUploader = require('../config/cloudinary.config');
const User = require('../models/User.model');

router.get('/boats', async (req, res, next) => {
  try {
    const allBoats = await Boat.find();
    res.json(allBoats);
  } catch (error) {
    console.log('An error occurred getting all the boats', error);
    next(error);
  }
});

router.post('/newboat', async (req, res, next) => {
  const {
    title,
    imgURL,
    type,
    year,
    condition,
    length,
    beam,
    draught,
    displacement,
    material,
    steering,
    keel,
    ballast,
    headroom,
    cabins,
    berths,
    watertank,
    propulsion,
    engine,
    fuelType,
    description,
    country,
    price
  } = req.body;
  const ownerId = req.payload._id;

  try {
    const newBoat = await Boat.create({
      title,
      imgURL,
      type,
      owner: ownerId,
      year,
      condition,
      length,
      beam,
      draught,
      displacement,
      material,
      steering,
      keel,
      ballast,
      headroom,
      cabins,
      berths,
      watertank,
      propulsion,
      engine,
      fuelType,
      description,
      country,
      price
    });
    res.json(newBoat);
  } catch (error) {
    console.log('An error occurred creating a new boat', error);
    next(error);
  }
});

router.get('/boats/:id', async (req, res, next) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ message: 'Specified id is not valid on showing boat details' });
    }

    const boat = await Boat.findById(id).populate('owner');
    if (!boat) {
      return res.status(404).json({ message: 'No boat found with that id' });
    }

    res.json(boat);
  } catch (error) {
    console.log('An error occurred getting the boat', error);
    next(error);
  }
});

router.put('/boats/:id', async (req, res, next) => {
  const { id } = req.params;
  const ownerId = req.params._id;
  const {
    title,
    imgURL,
    type,
    year,
    condition,
    length,
    beam,
    draught,
    displacement,
    material,
    steering,
    keel,
    ballast,
    headroom,
    cabins,
    berths,
    watertank,
    propulsion,
    engine,
    fuelType,
    description,
    country,
    price
  } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(id))
      return res
        .status(400)
        .json({ message: 'Specified Id is not valid on edit boats' });

    const updatedBoat = await Boat.findByIdAndUpdate(
      id,
      {
        title,
        imgURL,
        type,
        year,
        condition,
        length,
        beam,
        draught,
        displacement,
        material,
        steering,
        keel,
        ballast,
        headroom,
        cabins,
        berths,
        watertank,
        propulsion,
        engine,
        fuelType,
        description,
        country,
        price
      },
      { new: true } //We need to pass this to receive the updated values
    );

    if (!updatedBoat) {
      return res
        .status(404)
        .json({ message: 'No boat found with specified id' });
    }
    /* if (updatedBoat.owner !== ownerId) {
      return res
        .status(403)
        .json({ message: 'You are not the owner of this post' });
    } */
    res.json(updatedBoat);
  } catch (error) {
    console.log('An error ocurred updating the boat', error);
    next(error);
  }
});

router.delete('/boats/:id', async (req, res, next) => {
  const { id } = req.params;
  const ownerId = req.payload._id;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ message: 'Specified id is not valid on delete boats' });
    }
    /* if (Boat.owner !== ownerId) {
      return res
        .status(403)
        .json({ message: 'You are not the owner of this post' });
    } */
    await Boat.findByIdAndDelete(id);
    res.json({ message: `Boat with id ${id} was deleted successfuly` });
  } catch (error) {
    console.log('An error ocurred deleting the boat', error);
    next(error);
  }
});

router.post('/upload', fileUploader.array('files', 20), (req, res, next) => {
  try {
    res.json({ fileUrl: req.files[0].path });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred uploading the files' });
    next(error);
  }
});

router.post('/search', async (req, res) => {
  const searchQuery = req.body.search;
  const boats = await Boat.find();

  const filteredBoats = boats.filter(boat => {
    if (boat.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return boat;
    } else {
      return;
    }
  });
  res.json({ boats: filteredBoats, searchQuery });
});

router.get('/boats/favourites', async (req, res) => {
  try {
    const userId = req.payload._id;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }
    const user = await User.findById(userId).populate('favouriteBoats');
    console.log('user.favboats', user.favouriteBoats);
    res.json({ favouriteBoats: user.favouriteBoats });
  } catch (error) {
    console.log('Error in boats/favourites', error);
    console.log('req.payload:', req.payload);
    console.log('Request headers:', req.headers);
    console.log('favouriteboats:', favouriteBoats);
    res.status(400).json({ message: 'Error in boats/favourites' });
  }
});

router.post('/boats/:id/favourites', async (req, res) => {
  const userId = req.payload._id;
  const userToCheck = await User.findById(userId);
  const user = await User.findByIdAndUpdate(userId, {
    $push: { favouriteBoats: req.params.id }
  });
  res.json(user);
});

router.post('/boats/favourites/delete/:id', async (req, res) => {
  try {
    const userId = req.payload._id;
    await User.findByIdAndUpdate(userId, {
      $pull: { favouriteBoats: req.params.id }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting favourite boat' });
  }
});

module.exports = router;
