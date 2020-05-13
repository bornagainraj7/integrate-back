const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
  firstName: { type: String },
  lastName: { type: String },
  fullName: { type: String },
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
  isBlocked: { type: Boolean },
  userType: { type: String },
  createdOn: { type: Date, default: new Date() },
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
