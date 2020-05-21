const mongoose = require('mongoose');
const uuid = require('uuid');

const complaintTypeSchema = mongoose.Schema({
  _id: { type: String, default: uuid.v4 },
  name: { type: String },
  policyTypeId: { type: String, ref: 'policy_type' },
  isActive: { type: Boolean },
  createdAt: { type: Number },
  updatedAt: { type: Number },
});

complaintTypeSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  return next();
});

complaintTypeSchema.pre('findOneAndUpdate', function (next) {
  this.updatedAt = Date.now();
  return next();
});

complaintTypeSchema.pre('findByIdAndUpdate', function (next) {
  this.updatedAt = Date.now();
  return next();
});

complaintTypeSchema.pre('updateOne', function (next) {
  this.updatedAt = Date.now();
  return next();
});

module.exports = mongoose.model('complaint_type', complaintTypeSchema, 'complaint_type');
