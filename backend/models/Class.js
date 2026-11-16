const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  title: { type: String, required: true },
  time: { type: String, required: true },
  duration: { type: String, required: true },
  type: { type: String, required: true },
  coach: { type: String, required: true },
  availability: { type: String, required: true },
  borderColor: { type: String, default: '#ea4c2b' },
  day: { type: String, required: true },
  category: { type: String, required: true } // <-- NEW: "Class" or "Training"
});

module.exports = mongoose.model('Class', classSchema);