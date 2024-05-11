const express = require('express');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 3000;

// Configure Cloudinary with your cloud name, API key, and API secret
cloudinary.config({
  cloud_name: 'dlsfdnt5m',
  api_key: '155649525428376',
  api_secret: 'TBRNN-q-xHyiVG4B6gkPqeRWW3o'
});

// Multer setup for handling file uploads



const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/') // Specify the directory where uploaded files should be stored
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname) // Specify how the uploaded files should be named
  }
});
const upload = multer({ storage: storage });

// Route for uploading videos to Cloudinary
app.post('/api/upload-video', upload.single('video'), async (req, res) => {
  try {
    const file = req.file;
    const result = await cloudinary.uploader.upload(file.path);
    // Save the video URL to your database or perform any other necessary operations
    res.json({ url: result.secure_url });
  } catch (error) {
    console.error('Error uploading video:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route for deleting videos from Cloudinary
app.delete('/api/delete-video', async (req, res) => {
  try {
    const { url } = req.query;
    // Implement logic to delete the video from Cloudinary (if necessary)
    res.json({ message: 'Video deleted successfully' });
  } catch (error) {
    console.error('Error deleting video:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route for managing workouts (e.g., create, update, delete)


// Implement other CRUD routes for workouts as needed

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
