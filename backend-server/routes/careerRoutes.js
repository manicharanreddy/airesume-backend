const express = require('express');
const router = express.Router();
const { 
  predictFutureSkills,
  checkBias,
  generatePortfolio,
  predictInterviewQuestions
} = require('../controllers/careerController');

// Future skill prediction endpoint
router.post('/predict-skills', predictFutureSkills);

// Bias checking endpoint
router.post('/check-bias', checkBias);

// Portfolio generation endpoint
router.post('/generate-portfolio', generatePortfolio);

// Interview question prediction endpoint
router.post('/predict-interview-questions', predictInterviewQuestions);

module.exports = router;