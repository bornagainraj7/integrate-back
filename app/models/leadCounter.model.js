const mongoose = require('mongoose');


const leadCounter = mongoose.Schema({
  _id: { type: String, default: 'LeadCounter' },
  counter: { type: Number, default: 1 },
});

module.exports = mongoose.model('leadCounter', leadCounter, 'leadCounter');
