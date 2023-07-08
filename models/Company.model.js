const { Schema, model } = require('mongoose');

const companySchema = new Schema(
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
    password: {
      type: String,
      required: [true, 'Password is required.']
    }
  },
  {
    timestamps: true
  }
);

const Company = model('Company', companySchema);

module.exports = Company;
