const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type:String,
    required: true
  },
  // name: String,
  // followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Trainee' }]
  // Add any other fields specific to Trainer model
});
// dietPlan.model.js

const User = mongoose.model('user',userSchema);
module.exports = User;

