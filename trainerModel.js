const mongoose = require('mongoose');

const trainerSchema = mongoose.Schema({
    name: { type: String, required: true },
    videos: [{ type: String }]
});

module.exports = mongoose.model('Trainer', trainerSchema);
