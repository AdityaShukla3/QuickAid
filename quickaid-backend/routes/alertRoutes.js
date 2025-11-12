const express = require('express');
const router = express.Router();
const { createAlert, getAllAlerts, findNearbyResponders, updateStatus } = require('../controllers/alertController');
const { protect } = require('../middleware/authMiddleware'); // JWT check

router.post('/sos', protect, createAlert);
router.get('/all', getAllAlerts);
router.get('/nearby', findNearbyResponders);
router.put('/:id/status', protect, updateStatus);

module.exports = router;

