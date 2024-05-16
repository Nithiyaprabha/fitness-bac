const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { userSchema } = require('./schema');
const app = express();
const cors = require('cors');
const port = 4000;
const User = require('./schema')
app.use(express.json());
app.use(cors());

mongoose.connect('mongodb+srv://nithiya_5:nithiya_2005@cluster0.a02jqzo.mongodb.net/fitness?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});

app.post('/signup', async (req, res) => {
  const { name,email, password, role } = req.body;

  if (!email || !password || !role || !name) {
    return res.status(400).json({ error: 'Email, password, and role are required' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      password: hashedPassword,
      role
    });

    await newUser.save();

    res.status(201).json({ message: 'User signed up successfully' });
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

    // Assuming the user ID is stored in the _id field of the user document
    const userId = user._id;

    // Redirect to /login/:userId based on the user's role
    if (user.role === 'trainer') {
      res.status(200).json({ message: 'Trainer login successful', userId });
    } else if (user.role === 'trainee') {
      res.status(200).json({ message: 'Trainee login successful', userId });
    } else {
      // Handle unknown role
      res.status(401).json({ error: 'Invalid role' });
    }
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
