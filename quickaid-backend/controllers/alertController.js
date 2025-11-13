const Alert = require('../models/alertModel');
const Responder = require('../models/responderModel');

// Create new SOS alert
const createAlert = async (req, res) => {
  try {
    const { type, location, severity } = req.body;
    const newAlert = await Alert.create({
      user: req.user.id,
      type,
      location,
      severity
    });

    global.io.emit('alert-broadcast', {
      id: newAlert._id,
      type,
      location,
      severity,
      status: 'pending'
    });

    res.status(201).json({ message: 'SOS alert created', alert: newAlert });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Fetch all alerts (for testing/admin)
const getAllAlerts = async (req, res) => {
  const alerts = await Alert.find().populate('user', 'name email');
  res.status(200).json(alerts);
};

// Find nearby responders (dummy distance ≤ 5 km)
const findNearbyResponders = async (req, res) => {
  const { lat, lng } = req.query;
  const responders = await Responder.find({ available: true });
  // Basic filtering
  const nearby = responders.filter(r => Math.abs(r.location.lat - lat) < 0.05 && Math.abs(r.location.lng - lng) < 0.05);
  res.status(200).json(nearby);
};

// Update alert status
const updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const updated = await Alert.findByIdAndUpdate(id, { status }, { new: true });
  res.status(200).json(updated);
};

module.exports = { createAlert, getAllAlerts, findNearbyResponders, updateStatus };
