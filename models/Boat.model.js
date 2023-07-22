const { Schema, model } = require('mongoose');

const boatSchema = new Schema(
  {
    title: {
      type: String,
      required: true
    },

    imgURL: [
      {
        type: String,
        required: true
      }
    ],

    type: {
      type: String,
      required: true
    },

    year: String,
    condition: String,
    length: String,
    beam: String,
    draught: String,
    displacement: String,
    material: String,
    steering: String,
    keel: String,
    ballast: String,
    headroom: String,
    cabins: String,
    berths: String,
    watertank: String,
    propulsion: String,
    engine: String,
    fuelType: String,

    description: {
      type: String,
      required: true
    },

    country: {
      type: String,
      required: true
    },
    price: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

const Boat = model('Boat', boatSchema);

module.exports = Boat;
