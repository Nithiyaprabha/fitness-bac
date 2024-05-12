// const express = require('express');
// const cloudinary = require('cloudinary').v2;
// const multer = require('multer');

// const app = express();
// const PORT = process.env.PORT || 3000;

// // Configure Cloudinary with your cloud name, API key, and API secret
// cloudinary.config({
//   cloud_name: 'dlsfdnt5m',
//   api_key: '155649525428376',
//   api_secret: 'TBRNN-q-xHyiVG4B6gkPqeRWW3o'
// });

// // Multer setup for handling file uploads



// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/') // Specify the directory where uploaded files should be stored
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname) // Specify how the uploaded files should be named
//   }
// });
// const upload = multer({ storage: storage });

// // Route for uploading videos to Cloudinary
// app.post('/api/upload-video', upload.single('video'), async (req, res) => {
//   try {
//     const file = req.file;
//     const result = await cloudinary.uploader.upload(file.path);
//     // Save the video URL to your database or perform any other necessary operations
//     res.json({ url: result.secure_url });
//   } catch (error) {
//     console.error('Error uploading video:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// // Route for deleting videos from Cloudinary
// app.delete('/api/delete-video', async (req, res) => {
//   try {
// //     const { url } = req.query;
// //     // Implement logic to delete the video from Cloudinary (if necessary)
// //     res.json({ message: 'Video deleted successfully' });
// //   } catch (error) {
// //     console.error('Error deleting video:', error);
// //     res.status(500).json({ error: 'Internal server error' });
// //   }
// // });

// // // Route for managing workouts (e.g., create, update, delete)


// // // Implement other CRUD routes for workouts as needed

// // app.listen(PORT, () => {
// //   console.log(`Server is running on port ${PORT}`);
// // });

// const express = require('express');
// const multer = require('multer');
// const cloudinary = require('cloudinary').v2;
// const Video = require('./video.js'); // Import your Mongoose Video model
// const router = express.Router();

// // Configure multer storage
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/');
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + '-' + file.originalname);
//   }
// });

// // Initialize Cloudinary
// cloudinary.config({
//   cloud_name: 'dlsfdnt5m',
//   api_key: '155649525428376',
//   api_secret: 'TBRNN-q-xHyiVG4B6gkPqeRWW3o'
// });

// // Multer upload middleware
// const upload = multer({ storage: storage }).single('video');

// // Multer error handler middleware
// router.use(function(err, req, res, next) {
//   if (err instanceof multer.MulterError) {
//     console.error('Multer error:', err);
//     if (err.code === 'LIMIT_FILE_SIZE') {
//       return res.status(400).json({ error: 'File size too large. Maximum 5MB allowed.' });
//     } else {
//       return res.status(400).json({ error: 'File upload error' });
//     }
//   } else if (err) {
//     console.error('Unknown error:', err);
//     res.status(500).json({ error: 'Internal server error' });
//   } else {
//     next(); // No multer error, continue to next middleware
//   }
// });

// // Video upload endpoint
// router.post('api/upload-video', (req, res) => {
//   upload(req, res, async (err) => {
//     if (err) {
//       console.error('Multer error:', err);
//       return res.status(400).json({ error: 'File upload error' });
//     }

//     try {
//       const { title, description } = req.body;
//       const videoFile = req.file.path; // Path to the uploaded video file

//       // Upload video to Cloudinary
//       const cloudinaryResponse = await cloudinary.uploader.upload(videoFile, { resource_type: "video" });

//       // Save video details to database
//       const video = new Video({
//         title,
//         description,
//         videoUrl: cloudinaryResponse.secure_url // Store the video URL from Cloudinary
//       });
//       await video.save();

//       res.status(200).json({ message: 'Video uploaded successfully' });
//     } catch (error) {
//       console.error('Error occurred while uploading video:', error);
//       res.status(500).json({ error: 'Internal server error' });
//     }
//   });
// });

// module.exports = router;

// const express = require('express');
// const multer = require('multer');
// const cloudinary = require('cloudinary').v2;
// const Video = require('./video.js'); // Import your Mongoose Video model
// const router = express.Router();

// // Configure multer storage
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/');
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + '-' + file.originalname);
//   }
// });

// // Initialize Cloudinary
// cloudinary.config({
//   cloud_name: 'dlsfdnt5m',
//   api_key: '155649525428376',
//   api_secret: 'TBRNN-q-xHyiVG4B6gkPqeRWW3o'
// });

// // Multer upload middleware
// const upload = multer({ storage: storage }).single('video');

// // Multer error handler middleware
// router.use(function(err, req, res, next) {
//   if (err instanceof multer.MulterError) {
//     console.error('Multer error:', err);
//     if (err.code === 'LIMIT_FILE_SIZE') {
//       return res.status(400).json({ error: 'File size too large. Maximum 5MB allowed.' });
//     } else {
//       return res.status(400).json({ error: 'File upload error' });
//     }
//   } else if (err) {
//     console.error('Unknown error:', err);
//     res.status(500).json({ error: 'Internal server error' });
//   } else {
//     next(); // No multer error, continue to next middleware
//   }
// });

// // Video upload endpoint
// router.post('api/upload-video', (req, res) => {
//   upload(req, res, async (err) => {
//     if (err) {
//       console.error('Multer error:', err);
//       return res.status(400).json({ error: 'File upload error' });
//     }

//     try {
//       const { title, description } = req.body;
//       const videoFile = req.file.path; // Path to the uploaded video file

//       // Upload video to Cloudinary
//       const cloudinaryResponse = await cloudinary.uploader.upload(videoFile, { resource_type: "video" });

//       // Save video details to database
//       const video = new Video({
//         title,
//         description,
//         videoUrl: cloudinaryResponse.secure_url // Store the video URL from Cloudinary
//       });
//       await video.save();

//       res.status(200).json({ message: 'Video uploaded successfully' });
//     } catch (error) {
//       console.error('Error occurred while uploading video:', error);
//       res.status(500).json({ error: 'Internal server error' });
//     }
//   });
// });

// module.exports = router;

// const express = require('express');
// const multer = require('multer');
// const cloudinary = require('cloudinary').v2;
// const Video = require('./video.js'); // Import your Mongoose Video model
// const router = express.Router();

// // Configure multer storage
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'Uploads/');
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + '-' + file.originalname);
//   }
// });

// // Initialize Cloudinary
// cloudinary.config({
//   cloud_name: 'dlsfdnt5m',
//   api_key: '155649525428376',
//   api_secret: 'TBRNN-q-xHyiVG4B6gkPqeRWW3o'
// });

// Multer upload middleware
// const upload = multer({ storage: storage }).single('video');

// // Multer error handler middleware
// router.use(function(err, req, res, next) {
//   if (err instanceof multer.MulterError) {
//     console.error('Multer error:', err);
//     return res.status(400).json({ error: 'File upload error' });
//   } else if (err) {
//     console.error('Unknown error:', err);
//     res.status(500).json({ error: 'Internal server error' });
//   } else {
//     next(); // No multer error, continue to next middleware
//   }
// });

// // Video upload endpoint
// router.post('/api/upload-video', (req, res) => {
//   upload(req, res, async (err) => {
//     if (err) {
//       console.error('Multer error:', err);
//       return res.status(400).json({ error: 'File upload error' });
//     }

//     try {
//       const { title, description } = req.body;
//       const videoFile = req.file.path; // Path to the uploaded video file

//       // Upload video to Cloudinary
//       const cloudinaryResponse = await cloudinary.uploader.upload(videoFile, { resource_type: "video" });

//       // Save video details to database
//       const video = new Video({
//         title,
//         description,
//         videoUrl: cloudinaryResponse.secure_url // Store the video URL from Cloudinary
//       });
//       await video.save();

//       res.status(200).json({ message: 'Video uploaded successfully' });
//     } catch (error) {
//       console.error('Error occurred while uploading video:', error);
//       res.status(500).json({ error: 'Internal server error' });
//     }
//   });
// });

// module.exports = router;

const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const Video = require('./video.js'); // Import your Mongoose Video model

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
const upload = multer({ storage: storage }).single('video');

// Multer error handler middleware
router.use(function(err, req, res, next) {
  if (err instanceof multer.MulterError) {
    console.error('Multer error:', err);
    return res.status(400).json({ error: 'File upload error' });
  } else if (err) {
    console.error('Unknown error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
  next(); // No multer error, continue to next middleware
});

// Video upload endpoint
router.post('/api/upload-video', (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error('Multer error:', err);
      return res.status(400).json({ error: 'File upload error' });
    }

    try {
      const { title, description } = req.body;
      const videoFile = req.file.path; // Path to the uploaded video file

      // Upload video to Cloudinary
      const cloudinaryResponse = await cloudinary.uploader.upload(videoFile, { resource_type: "video" });

      // Save video details to database
      const video = new Video({
        title,
        description,
        videoUrl: cloudinaryResponse.secure_url // Store the video URL from Cloudinary
      });
      await video.save();

      // Delete the temporary uploaded file
      // fs.unlinkSync(videoFile);

      res.status(200).json({ message: 'Video uploaded successfully' });
    } catch (error) {
      console.error('Error occurred while uploading video:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
});

module.exports = router;
