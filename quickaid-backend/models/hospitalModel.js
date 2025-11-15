const mongoose = require('mongoose');

const hospitalSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Hospital name is required'],
    trim: true
  },
  contact: {
    phone: { type: String, required: true },
    email: { type: String, trim: true, lowercase: true }
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      // [lng, lat]
      type: [Number],
      required: [true, 'Coordinates required']
    },
    address: { type: String }
  },
  bedsAvailable: {
    type: Number,
    default: 0,
    min: 0
  },
  services: {
    // e.g. ['trauma', 'icu', 'cardiology', 'maternity']
    type: [String],
    default: []
  },
  emergencyContact: {
    name: { type: String },
    phone: { type: String }
  },
  verified: {
    type: Boolean,
    default: false
  },
  open24x7: {
    type: Boolean,
    default: true
  },
  meta: {
    rating: { type: Number, min: 0, max: 5 },
    notes: { type: String }
  }
}, {
  timestamps: true
});

// Create 2dsphere index to support geospatial queries
hospitalSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Hospital', hospitalSchema);
