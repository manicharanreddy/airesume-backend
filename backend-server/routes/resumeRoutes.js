const express = require('express');
const router = express.Router();
const multer = require('multer');
const { 
  uploadResume,
  getJobMatch,
  simulateCareerPath
} = require('../controllers/resumeController');

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Resume upload endpoint
router.post('/upload', upload.single('resume'), uploadResume);

// Job matching endpoint
router.post('/match', getJobMatch);

// Career path simulation endpoint
router.post('/simulate-career', simulateCareerPath);

module.exports = router;