const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const uuid = require('uuid');

const userSchema = mongoose.Schema({
  _id: { type: String, default: uuid.v4 },
  name: { type: String },
  mobile: {
    type: String,
    index: true,
    unique: true,
    required: true,
  },
  email: {
    type: String,
    index: true,
    unique: true,
    required: true,
  },
  userName: { type: String },
  profilePic: { type: String },
  dob: { type: Date },
  address: { type: String },
  panNumber: { type: String },
  aadhaarNumber: { type: String },
  age: { type: Number },
  companyName: { type: String },
  about: { type: String },
  gender: { type: String, enum: ['Male', 'Female'] },
  website: { type: String },
  natureOfBusiness: { type: String },
  areaOfOperation: [{ type: String }],
  userType: { type: String },
  isBlocked: { type: Boolean },
  isActive: { type: Boolean },
  isVerified: { type: Boolean },
  isAgreed: { type: Boolean },
  agreedOn: { type: Date },
  createdAt: { type: Number, default: null },
});

userSchema.plugin(uniqueValidator);

userSchema.pre('save', function (next) {
  this.createdAt = Date.now();
  return next();
});

module.exports = mongoose.model('user', userSchema, 'user');
