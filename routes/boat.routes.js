const router = require('express').Router();
const Boat = require('../models/Boat.model');
const mongoose = require('mongoose');
const fileUploader = require('../config/cloudinary.config');

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
  const { title, imgURL, type, form, description, country } = req.body;

  try {
    const newBoat = await Boat.create({
      title,
      imgURL,
      type,
      form,
      description,
      country
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
      return res.status(400).json({ message: 'Specified id is not valid' });
    }

    const boat = await Boat.findById(id);
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
  const { title, imgURL, type, form, description, country } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: 'Specified Id is not valid' });

    const updatedBoat = await Boat.findByIdAndUpdate(
      id,
      {
        title,
        imgURL,
        type,
        form,
        description,
        country
      },
      { new: true } //We need to pass this to receive the updated values
    );

    if (!updatedBoat) {
      return res
        .status(404)
        .json({ message: 'No boat found with specified id' });
    }
    res.json(updatedBoat);
  } catch (error) {
    console.log('An error ocurred updating the boat', error);
    next(error);
  }
});

router.delete('/boats/:id', async (req, res, next) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Specified id is not valid' });
    }
    await Boat.findByIdAndDelete(id);
    res.json({ message: `Boat with id ${id} was deleted successfuly` });
  } catch (error) {
    console.log('An error ocurred deleting the boat', error);
    next(error);
  }
});

router.post('/upload', fileUploader.array('files'), (req, res, next) => {
  try {
    res.json({ fileUrl: req.files[0].path });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred uploading the files' });
    next(error);
  }
});

module.exports = router;
