// models.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
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
  // likedVideos: [{ type: Schema.Types.ObjectId, ref: 'Video' }],
  // followers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  // followedTrainers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  // name: String,
  // followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Trainee' }]
  // Add any other fields specific to Trainer model

likedVideos: [{ 
  type: Schema.Types.ObjectId, 
  ref: 'Video' 
}],
followers: [{ 
  type: Schema.Types.ObjectId, 
  ref: 'User' 
}],
followedTrainers: [{ 
  type: Schema.Types.ObjectId, 
  ref: 'User' 
}],
// dietPlan.model.js
});
const User = mongoose.model('user',userSchema);
module.exports = User;

// const dietPlanSchema = new mongoose.Schema({
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true,
//   },
//   plan: {
//     type: String,
//     required: true,
//   },
// });

// module.exports = mongoose.model('DietPlan', dietPlanSchema);


// const traineeSchema = new mongoose.Schema({
//   email: {
//     type: String,
//     required: true,
//     unique: true
//   },
//   password: {
//     type: String,
//     required: true
//   },
//   // Add any other fields specific to Trainee model
// });



// Define the schema for workouts
// const WorkoutSchema = new mongoose.Schema({
//   title: {
//     type: String,
//     required: true
//   },
//   description: {
//     type: String,
//     required: true
//   },
//   duration: {
//     type: Number,
//     required: true
//   },
//   difficulty: {
//     type: String,
//     enum: ['Easy', 'Medium', 'Hard'],
//     default: 'Medium'
//   },
//   imageUrl: {
//     type: String
//   },
//   // You can add more fields as needed
// });

// // Create a model for workouts
// const Workout = mongoose.model('Workout', WorkoutSchema);

// module.exports = Workout;

