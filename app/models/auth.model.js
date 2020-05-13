const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const authSchema = mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
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
  validUpto: { type: Date },
  secretKey: { type: String },
  password: { type: String },
});

authSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Auth', authSchema);
