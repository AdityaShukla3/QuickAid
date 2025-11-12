const mongoose = require('mongoose');

const responderSchema = new mongoose.Schema({
  name: String,
  contact: String,
  type: { type: String, enum: ['doctor', 'ambulance', 'volunteer'] },
  location: { lat: Number, lng: Number },
  available: { type: Boolean, default: true }
});

module.exports = mongoose.model('Responder', responderSchema);
