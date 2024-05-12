const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const Workout = require('./workoutmodel.js'); // Import your Mongoose Workout model
const router = express.Router();

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// Initialize Cloudinary
cloudinary.config({
  cloud_name: 'dlsfdnt5m',
  api_key: '155649525428376',
  api_secret: 'TBRNN-q-xHyiVG4B6gkPqeRWW3o'
});

// Multer upload middleware
const upload = multer({ storage: storage }).single('image');

// Multer error handler middleware
router.use(function(err, req, res, next) {
  if (err instanceof multer.MulterError) {
    console.error('Multer error:', err);
    return res.status(400).json({ error: 'File upload error' });
  } else if (err) {
    console.error('Unknown error:', err);
    res.status(500).json({ error: 'Internal server error' });
  } else {
    next(); // No multer error, continue to next middleware
  }
});

// Workout upload endpoint
router.post('/api/workouts', (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error('Multer error:', err);
      return res.status(400).json({ error: 'File upload error' });
    }

    try {
      const { trainerId, workoutName, description, category } = req.body;
      const imageUrl = req.file.path; // Path to the uploaded image file

      // Upload image to Cloudinary
      const cloudinaryResponse = await cloudinary.uploader.upload(imageUrl, { folder: 'workouts' });

      // Save workout details to database
      const workout = new Workout({
        trainerId,
        workoutName,
        description,
        category,
        imageUrl: cloudinaryResponse.secure_url // Store the image URL from Cloudinary
      });
      await workout.save();

      res.status(200).json({ message: 'Workout added successfully', workout });
    } catch (error) {
      console.error('Error occurred while adding workout:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
});

module.exports = router;
