const mongoose = require('mongoose');
const videoSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    },
    uploader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trainer' // Assuming you have a Trainer model for uploadedBy field
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  });
  
  // Create the Video model
  const Video = mongoose.model('Video', videoSchema);
  
  // Export the Video model
  module.exports = Video;
