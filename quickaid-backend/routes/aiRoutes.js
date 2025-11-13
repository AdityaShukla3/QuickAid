const express = require('express');
const { getFirstAidGuide } = require('../controllers/aiController');
const router = express.Router();

router.post('/firstaid', getFirstAidGuide);

module.exports = router;
