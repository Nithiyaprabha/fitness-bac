const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const User = require('./usermodel');
const bcrypt = require('bcryptjs');
const Workout = require('./workoutmodel');
const multer = require('multer');
const Trainer = require('./trainerModel');
const Video = require('./video');
const cloudinary = require('cloudinary').v2;
const LikedVideos = require('./likedVideos')
const DietPlan = require('./diet');

const app = express();
const port = process.env.PORT || 3000;

dotenv.config();

app.use(express.json());
app.use(cors());

mongoose.connect(`mongodb+srv://nithiya_5:nithiya_2005@cluster0.a02jqzo.mongodb.net/fitness?retryWrites=true&w=majority`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});

app.post('/signup', async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!email || !password || !role || !name) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });

    await newUser.save();

    res.status(201).json({ message: 'User signed up successfully', userId: newUser._id });
  } catch (error) {
    console.error('Error signing up user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const userId = user._id;

    res.status(200).json({ message: `${user.role} login successful`, userId, role: user.role });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/getTrainerDetails', async (req, res) => {
  const { trainerId } = req.query;
  try {
    const trainer = await Trainer.findById(trainerId);
    res.status(200).json({ trainer });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/getTrainerVideos', async (req, res) => {
  const { trainerId } = req.query;
  try {
    const trainer = await Trainer.findById(trainerId);
    res.status(200).json({ videos: trainer.videos });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Initialize Cloudinary
cloudinary.config({
  cloud_name: 'dlsfdnt5m',
  api_key: '155649525428376',
  api_secret: 'TBRNN-q-xHyiVG4B6gkPqeRWW3o',
});

// Configure Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

// Multer upload middleware
const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('video/') || file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Not a valid file!'), false);
    }
  },
});

// Multer error handler middleware
app.use(function (err, req, res, next) {
  if (err instanceof multer.MulterError) {
    console.error('Multer error:', err);
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File size too large. Maximum 50MB allowed.' });
    } else {
      return res.status(400).json({ error: 'File upload error' });
    }
  } else if (err) {
    console.error('Unknown error:', err);
    res.status(500).json({ error: 'Internal server error' });
  } else {
    next();
  }
});

// Video upload route
app.post('/uploadVideo', upload.single('video'), async (req, res) => {
  const { title, trainerId } = req.body;

  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const { path } = req.file;

  try {
    const result = await cloudinary.uploader.upload(path, { resource_type: 'video' });

    const newVideo = new Video({
      title,
      url: result.secure_url,
      uploadedBy: trainerId,
    });

    await newVideo.save();

    res.status(200).json({ url: result.secure_url });
  } catch (error) {
    console.error('Error uploading video:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Workout upload route
app.post('/addWorkout', upload.single('image'), async (req, res) => {
  const { trainerId, workoutName, description, category } = req.body;

  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const { path } = req.file;

  try {
    const result = await cloudinary.uploader.upload(path);

    const newWorkout = new Workout({
      trainerId,
      workoutName,
      description,
      category,
      imageUrl: result.secure_url,
    });

    await newWorkout.save();
    res.status(201).json({ message: 'Workout added successfully', workout: newWorkout });
  } catch (error) {
    console.error('Error adding workout:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.get('/getAllData', async (req, res) => {
  try {
    const videos = await Video.find();
    const workouts = await Workout.find();
    res.json({ videos, workouts });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

app.get('/getVideos', async (req, res) => {
  try {
    const videos = await Video.find().populate('uploader', 'name');
    res.json(videos);
  } catch (error) {
    console.error('Error fetching videos:', error);
    res.status(500).send('Failed to fetch videos');
  }
});

app.get('/getWorkouts', async (req, res) => {
  try {
    const workouts = await Workout.find();
    res.json(workouts);
  } catch (error) {
    console.error('Error fetching workouts:', error);
    res.status(500).send('Failed to fetch workouts');
  }
});



app.delete('/deleteVideo', async (req, res) => {
  const { url } = req.query;
  try {
    await Video.findOneAndDelete({ url });
    const trainer = await Trainer.findOneAndUpdate(
      { videos: url },
      { $pull: { videos: url } },
      { new: true }
    );

    const publicId = url.split('/').pop().split('.')[0];
    await cloudinary.uploader.destroy(publicId, { resource_type: 'video' });

    res.status(200).json({ message: 'Video deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/followTrainer', async (req, res) => {
  try {
    const { traineeId, trainerId } = req.body;

    // Add the trainer to the trainee's followed trainers list
    await User.findByIdAndUpdate(traineeId, { $addToSet: { followedTrainers: trainerId } });

    // Add the trainee to the trainer's followers list
    await User.findByIdAndUpdate(trainerId, { $addToSet: { followers: traineeId } });

    res.send('Followed successfully');
  } catch (error) {
    console.error('Error following trainer:', error);
    res.status(500).send('Failed to follow trainer');
  }
});



app.delete('/unfollowTrainer', async (req, res) => {
  try {
    const { traineeId, trainerId } = req.body;

    // Check if any of the required values are missing
    if (!traineeId || !trainerId) {
      return res.status(400).json({ error: 'Missing traineeId or trainerId' });
    }

    // Check if the trainee exists and is indeed a trainee
    const trainee = await User.findById(traineeId);
    if (!trainee) {
      return res.status(404).json({ error: 'Trainee not found' });
    }
    if (trainee.role !== 'trainee') {
      return res.status(403).json({ error: 'Only trainees can unfollow trainers' });
    }

    // Check if the trainee is following the trainer
    if (!trainee.followedTrainers.includes(trainerId)) {
      return res.status(400).json({ error: 'Trainee is not following this trainer' });
    }

    // Remove the trainerId from the trainee's followedTrainers list
    await User.findByIdAndUpdate(traineeId, { $pull: { followedTrainers: trainerId } }, { new: true });

    // Remove the traineeId from the trainer's followers list
    await User.findByIdAndUpdate(trainerId, { $pull: { followers: traineeId } }, { new: true });

    // Respond with success message
    res.status(200).json({ message: 'Unfollowed trainer successfully' });
  } catch (error) {
    console.error('Error unfollowing trainer:', error);
    res.status(500).json({ error: 'Failed to unfollow trainer' });
  }
})

app.get('/trainerProfile/:trainerId', async (req, res) => {
  try {
    const trainer = await User.findById(req.params.trainerId).populate('followers', 'name email');
    if (!trainer) {
      return res.status(404).send('Trainer not found');
    }
    res.json(trainer);
  } catch (error) {
    console.error('Error fetching trainer profile:', error);
    res.status(500).send('Failed to fetch trainer profile');
  }
});

app.post('/addToLikedVideos', async (req, res) => {
  try {
    const { videoId, userId } = req.body;

    // Check if any of the required values are missing
    if (!videoId || !userId) {
      return res.status(400).json({ error: 'Missing videoId or userId' });
    }

    // Find the user by userId
    const user = await User.findById(userId);

    // Check if user exists
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if the user is a trainee
    if (user.role !== 'trainee') {
      return res.status(403).json({ error: 'Only trainees can like videos' });
    }

    // Check if the liked videos list exists for the trainee
    let likedVideos = await LikedVideos.findOne({ traineeId: userId });

    // If liked videos list doesn't exist, create a new one
    if (!likedVideos) {
      likedVideos = new LikedVideos({ traineeId: userId, videos: [] });
    }

    // Check if the video is already in the liked videos list
    if (likedVideos.videos.includes(videoId)) {
      return res.status(400).json({ error: 'Video already exists in liked videos' });
    }

    // Add the videoId to the liked videos list
    likedVideos.videos.push(videoId);

    // Save the updated liked videos list
    await likedVideos.save();

    // Respond with success message
    res.status(200).json({ message: 'Video added to liked videos successfully' });
  } catch (error) {
    console.error('Error adding video to liked videos:', error);
    res.status(500).json({ error: 'Failed to add video to liked videos' });
  }
});


app.delete('/unlikeVideo/:videoId', async (req, res) => {
  try {
    const videoId = req.params.videoId;
    const userId = req.body.userId; // Assuming userId is sent in the request body

    let likedVideos = await LikedVideos.findOne({ traineeId: userId });

    if (!likedVideos) {
      return res.status(404).json({ error: 'Liked videos not found' });
    }

    likedVideos.videos = likedVideos.videos.filter(id => id.toString() !== videoId);

    await likedVideos.save();

    res.status(200).json({ message: 'Video removed from liked videos successfully' });
  } catch (error) {
    console.error('Error removing video from liked videos:', error);
    res.status(500).json({ error: 'Failed to remove video from liked videos' });
  }
});

app.get('/plans', async (req, res) => {
  try {
    const plans = await DietPlan.find();
    res.json(plans);
  } catch (error) {
    console.error('Error fetching diet plans:', error);
    res.status(500).json({ error: 'Failed to fetch diet plans' });
  }
});

// Get a single diet plan by ID
app.get('/plans/:id', async (req, res) => {
  try {
    const plan = await DietPlan.findById(req.params.id);
    if (!plan) {
      return res.status(404).json({ error: 'Diet plan not found' });
    }
    res.json(plan);
  } catch (error) {
    console.error('Error fetching diet plan:', error);
    res.status(500).json({ error: 'Failed to fetch diet plan' });
  }
});

// Create a new diet plan
app.post('/plans', async (req, res) => {
  try {
    const newPlan = new DietPlan(req.body);
    await newPlan.save();
    res.status(201).json(newPlan);
  } catch (error) {
    console.error('Error creating diet plan:', error);
    res.status(500).json({ error: 'Failed to create diet plan' });
  }
});

// Update an existing diet plan
app.put('/plans/:id', async (req, res) => {
  try {
    const updatedPlan = await DietPlan.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedPlan) {
      return res.status(404).json({ error: 'Diet plan not found' });
    }
    res.json(updatedPlan);
  } catch (error) {
    console.error('Error updating diet plan:', error);
    res.status(500).json({ error: 'Failed to update diet plan' });
  }
});

// Delete a diet plan
app.delete('/plans/:id', async (req, res) => {
  try {
    const deletedPlan = await DietPlan.findByIdAndDelete(req.params.id);
    if (!deletedPlan) {
      return res.status(404).json({ error: 'Diet plan not found' });
    }
    res.json({ message: 'Diet plan deleted successfully' });
  } catch (error) {
    console.error('Error deleting diet plan:', error);
    res.status(500).json({ error: 'Failed to delete diet plan' });
  }
});
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
