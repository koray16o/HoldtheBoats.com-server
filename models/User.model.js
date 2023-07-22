const { Schema, model } = require('mongoose');

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required.'],
      unique: true,
      lowercase: true,
      trim: true
    },
    name: {
      type: String,
      required: [true, 'Name is required']
    },
    img: {
      type: String
    },
    password: {
      type: String,
      required: [true, 'Password is required.']
    },
    isCompany: {
      type: Boolean,
      default: false
    },
    favouriteBoats: [{ type: Schema.Types.ObjectId, ref: 'Boat' }]
  },
  {
    timestamps: true
  }
);

const User = model('User', userSchema);

module.exports = User;
