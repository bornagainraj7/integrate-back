const mongoose = require('mongoose');
const uuid = require('uuid');

const leadSchema = mongoose.Schema({
  _id: { type: String, default: uuid.v4 },
  userId: { type: String, ref: 'user', required: true },
  user_id: { type: String }, // IVR lead user_id
  leadId: { type: String },
  name: { type: String, required: true },
  phone: { type: Number, required: true },
  email: { type: String, required: true },
  policyTypeId: { type: String, ref: 'policy_type', required: true },
  complaintTypeId: { type: String, ref: 'complaint_type', required: true },
  companyId: { type: String, ref: 'insurance_company' },
  policy_number: { type: String },
  status: { type: String, enum: ['PENDING', 'ACCEPTED', 'REJECTED', 'CONVERTED', 'REPEATED', 'OPEN', 'WRONG', 'QUERY', 'NOINSURANCE', 'NONCONTACTABLE', 'INCOMPLETE', 'ENQUIRY', 'FOLLOWUP'], default: 'PENDING' },
  src: { type: String }, // campaign
  med: { type: String },
  cpn: { type: String },
  ref: { type: String },
  location: { type: String },
  // policy_type: { type: String },
  // inc_comp_name: { type: String },
  // type_of_complaint: { type: String },
  issues_invloves: { type: String },
  no_policys_involved: { type: String },
  follow_up: { type: String },
  stage: { type: String },
  dailed: { type: String },
  no_policy_year: { type: String },
  total_value: { type: String },
  isActive: { type: Boolean },
  isPhoneVerified: { type: Boolean },
  assign_date: { type: Date },
  assign_to: { type: String },
  follow_date: { type: Date },
  docs: [{ type: String }],
  claim_amount: { type: String },
  ivr_discription: { type: String },
  communication: [{
    comment: { type: String },
    com_date: { type: Date },
    com_dis: { type: String },
  }],
  // created_date: { type: Date },
  updatedAt: { type: Number },
  createdAt: { type: Number },
});

leadSchema.pre('save', function (next) {
  this.createdAt = Date.now();
  return next();
});

leadSchema.pre('findOneAndUpdate', function (next) {
  this.updatedAt = Date.now();
  return next();
});

leadSchema.pre('findByIdAndUpdate', function (next) {
  this.updatedAt = Date.now();
  return next();
});

leadSchema.pre('updateOne', function (next) {
  this.updatedAt = Date.now();
  return next();
});


module.exports = mongoose.model('lead', leadSchema, 'lead');


// name, email, phone, policy_type(policyTypeId), (companyId), (CompailaintTypeId),
