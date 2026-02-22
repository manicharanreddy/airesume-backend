const express = require('express');
const router = express.Router();
const { predictFutureSkills } = require('../controllers/careerController');

// Future skill prediction endpoint
router.post('/predict-skills', predictFutureSkills);

module.exports = router;