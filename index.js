const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const User = require('../usermodel');
const bcrypt =require('bcrypt');
const Workout = require('../workoutmodel');
const cloudinary = require('./cloudinaryConfig');
const multer = require('multer');
const Trainer = require('../trainerModel');
const Video = require('../video');

const upload = multer({ dest: 'uploads/' });


const app = express();
const port = process.env.PORT || 4000;


dotenv.config();

app.use(express.json());
app.use(cors());


mongoose.connect('mongodb+srv://nithiya_5:nithiya_2005@cluster0.a02jqzo.mongodb.net/fitness?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
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
      role
    });

    await newUser.save();

    res.status(201).json({ message: 'User signed up successfully',userId: newUser._id });
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

app.get('/getTrainerDetails' ,async (req, res) => {
  const { trainerId } = req.query;
  try {
      const trainer = await Trainer.findById(trainerId);
      res.status(200).json({ trainer });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});


app.get('/getTrainerVideos' , async (req, res) => {
  const { trainerId } = req.params;
  try {
      const trainer = await Trainer.findById(trainerId);
      res.status(200).json({ videos: trainer.videos });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});

app.post('/uploadVideo' , async (req, res) => {
  const { title } = req.body;
  const { path } = req.file;
  try {
      const result = await cloudinary.uploader.upload(path, { resource_type: "video" });
      const newVideo = new Video({
          title,
          url: result.secure_url
      });
      await newVideo.save();

      const trainer = await Trainer.findById(req.body.trainerId);
      trainer.videos.push(result.secure_url);
      await trainer.save();
      
      res.status(200).json({ url: result.secure_url });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});

app.delete('/deleteVideo' , async (req, res) => {
  const { url } = req.query;
  try {
      await Video.findOneAndDelete({ url });
      const trainer = await Trainer.findOneAndUpdate(
          { videos: url },
          { $pull: { videos: url } },
          { new: true }
      );
      const publicId = url.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(publicId, { resource_type: "video" });
      res.status(200).json({ message: 'Video deleted successfully' });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});

app.post('/addWorkout ' ,async (req, res) => {
  const { trainerId, workoutName, description, category } = req.body;
  const { path } = req.file;
  try {
      const result = await cloudinary.uploader.upload(path);
      const newWorkout = new Workout({
          trainerId,
          workoutName,
          description,
          category,
          imageUrl: result.secure_url
      });
      await newWorkout.save();
      res.status(201).json({ message: 'Workout added successfully', workout: newWorkout });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});


// app.use('/api/users', userRoutes);
// app.use('/api/trainer', trainerRoutes);
// app.use('/api/workouts', workoutRoutes);
// module.exports = router;

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
