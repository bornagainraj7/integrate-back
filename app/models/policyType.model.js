const mongoose = require('mongoose');
const uuid = require('uuid');

const policyTypeSchema = mongoose.Schema({
  _id: { type: String, default: uuid.v4 },
  name: { type: String },
  isActive: { type: Boolean },
  createdAt: { type: Number },
  updatedAt: { type: Number },
});

policyTypeSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  return next();
});

policyTypeSchema.pre('findOneAndUpdate', function (next) {
  this.updatedAt = Date.now();
  return next();
});

policyTypeSchema.pre('findByIdAndUpdate', function (next) {
  this.updatedAt = Date.now();
  return next();
});

policyTypeSchema.pre('updateOne', function (next) {
  this.updatedAt = Date.now();
  return next();
});
module.exports = mongoose.model('policy_type', policyTypeSchema, 'policy_type');
