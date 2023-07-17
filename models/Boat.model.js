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

    form: {
      type: [String],
      required: true
    },

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
