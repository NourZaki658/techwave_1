const Class = require('../models/Class');

// @desc    Get all classes
// @route   GET /api/classes
const getClasses = async (req, res) => {
  try {
    const classes = await Class.find({});
    res.status(200).json(classes);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Seed initial classes (Just to populate the database once)
// @route   POST /api/classes/seed
const seedClasses = async (req, res) => {
  try {
    await Class.deleteMany({}); // Clear existing
    
    const initialClasses = [
      { title: 'Power circuit', time: '7:00 AM', duration: '45 MIN', type: 'HIIT · Studio 02', coach: 'Morgan Lee', availability: '6 spots left', borderColor: '#ea4c2b' },
      { title: 'Move & restore', time: '9:00 AM', duration: '60 MIN', type: 'Mobility · Studio 01', coach: 'Sam Rivera', availability: '10 spots left', borderColor: '#7b9e71' },
      { title: 'Lunch break lift', time: '12:00 PM', duration: '45 MIN', type: 'Strength · Gym floor', coach: 'Taylor Brooks', availability: 'Class full', borderColor: '#111' },
      { title: 'Strength foundations', time: '6:00 PM', duration: '50 MIN', type: 'Strength · Studio 01', coach: 'Jamie Chen', availability: 'Open', borderColor: '#111' }
    ];

    await Class.insertMany(initialClasses);
    res.status(201).json({ message: 'Classes seeded successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getClasses, seedClasses };