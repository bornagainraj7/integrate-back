const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const uuid = require('uuid');

const authSchema = mongoose.Schema({
  _id: { type: String, default: uuid.v4 },
  userId: { type: String, ref: 'user', required: true },
  email: {
    type: String,
    index: true,
    unique: true,
    required: true,
  },
  mobile: {
    type: String,
    index: true,
    unique: true,
    required: true,
  },
  token: { type: String },
  password: { type: String },
  validUpto: { type: Date },
  isVerified: { type: Boolean },
  isAuthorized: { type: Boolean },
  secretKey: { type: String },
  createdAt: { type: Number },
  updatedAt: { type: Number },
});

authSchema.plugin(uniqueValidator);

authSchema.pre('save', function (next) {
  this.createdAt = Date.now();
  return next();
});

authSchema.pre('findOneAndUpdate', function (next) {
  this.updatedAt = Date.now();
  return next();
});

authSchema.pre('findByIdAndUpdate', function (next) {
  this.updatedAt = Date.now();
  return next();
});

authSchema.pre('updateOne', function (next) {
  this.updatedAt = Date.now();
  return next();
});

module.exports = mongoose.model('auth', authSchema, 'auth');
