const mongoose = require('mongoose');
const uuid = require('uuid');

const insuranceCompanySchema = mongoose.Schema({
  _id: { type: String, default: uuid.v4 },
  name: { type: String },
  isActive: { type: Boolean },
  createdAt: { type: Number },
  updatedAt: { type: Number },
});

insuranceCompanySchema.pre('save', function (next) {
  this.createdAt = Date.now();
  return next();
});

insuranceCompanySchema.pre('findOneAndUpdate', function (next) {
  this.updatedAt = Date.now();
  return next();
});

insuranceCompanySchema.pre('findByIdAndUpdate', function (next) {
  this.updatedAt = Date.now();
  return next();
});

insuranceCompanySchema.pre('updateOne', function (next) {
  this.updatedAt = Date.now();
  return next();
});

module.exports = mongoose.model('insurance_company', insuranceCompanySchema, 'insurance_company');
