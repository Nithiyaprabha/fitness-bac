const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  followers: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'User' 
  }],
  followedTrainers: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'User' 
  }]
});

const User = mongoose.model('User', userSchema);
module.exports = User;
