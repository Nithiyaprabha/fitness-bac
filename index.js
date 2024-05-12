const express = require('express');
const mongoose = require('mongoose');
const { Trainer, Trainee } = require('./schema');
const cors = require('cors');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const uploadRouter = require('./server');
const workout = require('./workouts');
const app = express();
const port = 4000;


app.use('/api', uploadRouter);
app.use('/api', workout);

mongoose.connect('mongodb+srv://nithiya_5:nithiya_2005@cluster0.a02jqzo.mongodb.net/fitness?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});

app.use(express.json());
app.use(cors());

cloudinary.config({
  cloud_name: 'dlsfdnt5m',
  api_key: '155649525428376',
  api_secret: 'TBRNN-q-xHyiVG4B6gkPqeRWW3o'
});

// Multer setup for handling file uploads



// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/') // Specify the directory where uploaded files should be stored
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname) // Specify how the uploaded files should be named
//   }
// });
// const upload = multer({ storage: storage }).single('videos');

// // Multer error handler middleware
// app.use(function(err, req, res, next) {
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



app.post('/trainers/:trainerId/followers', async (req, res) => {
  try {
    const { trainerId } = req.params;
    const { followerId } = req.body;

    const trainer = await Trainer.findById(trainerId);
    if (!trainer) {
      return res.status(404).json({ error: 'Trainer not found' });
    }

    trainer.followers.push(followerId);
    await trainer.save();

    res.status(201).json({ message: 'Follower added successfully' });
  } catch (error) {
    console.error('Error adding follower:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to upload video for a trainer
// app.post('/trainers/:trainerId/videos', async (req, res) => {
//   try {
//     const { trainerId } = req.params;
//     const { title, url } = req.body;

//     const trainer = await Trainer.findById(trainerId);
//     if (!trainer) {
//       return res.status(404).json({ error: 'Trainer not found' });
//     }

//     const video = new Video({ title, url, trainer: trainerId });
//     await video.save();

//     res.status(201).json({ message: 'Video uploaded successfully' });
//   } catch (error) {
//     console.error('Error uploading video:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

app.post('/trainer/signup', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
   
    const existingTrainer = await Trainer.findOne({ email });
    if (existingTrainer) {
      return res.status(400).json({ error: 'Trainer already exists' });
    }

    
    const newTrainer = new Trainer({
      email,
      password
    });

    await newTrainer.save();

    res.status(201).json({ message: 'Trainer signed up successfully' });
  } catch (error) {
    console.error('Error signing up trainer:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
  
});

app.post('/api/workouts', async (req, res) => {
  try {
    // Implement logic to create a workout
    res.status(201).json({ message: 'Workout created successfully', workout: { name: 'Workout' } });
  } catch (error) {
    console.error('Error creating workout:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
app.post('/trainee/signup', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const existingTrainee = await Trainee.findOne({ email });
    if (existingTrainee) {
      return res.status(400).json({ error: 'Trainee already exists' });
    }

    const newTrainee = new Trainee({
      email,
      password
    });

    await newTrainee.save();

    res.status(201).json({ message: 'Trainee signed up successfully' });
  } catch (error) {
    console.error('Error signing up trainee:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/trainer/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const trainer = await Trainer.findOne({ email });
    if (!trainer || trainer.password !== password) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    res.status(200).json({ message: 'Trainer login successful' });
  } catch (error) {
    console.error('Error logging in trainer:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.post('/trainee/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const trainee = await Trainee.findOne({ email });
    if (!trainee || trainee.password !== password) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

   
    res.status(200).json({ message: 'Trainee login successful' });
  } catch (error) {
    console.error('Error logging in trainee:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// cloudinary.config({
//   cloud_name: 'dlsfdnt5m',
//   api_key: '155649525428376',
//   api_secret: 'TBRNN-q-xHyiVG4B6gkPqeRWW3o'
// });

// Multer setup for handling file uploads



// Route for uploading videos to Cloudinary
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
//     const { url } = req.query;
//     // Implement logic to delete the video from Cloudinary (if necessary)
//     res.json({ message: 'Video deleted successfully' });
//   } catch (error) {
//     console.error('Error deleting video:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// Route for managing workouts (e.g., create, update, delete)


// Implement other CRUD routes for workouts as needed



app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
