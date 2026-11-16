const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/authRoutes');
const bookingRoutes = require('./routes/bookingRoutes'); 
const classRoutes = require('./routes/classRoutes');     

app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes); 
app.use('/api/classes', classRoutes);    

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB successfully!'))
  .catch((err) => console.log('❌ MongoDB connection error:', err));

// Test Route
app.get('/', (req, res) => {
  res.send('Gym Backend is running!');
});

// ==========================================
// TEMPORARY ROUTE TO SEED CLASSES INTO DB
// ==========================================
const Class = require('./models/Class');
app.get('/seed-classes', async (req, res) => {
  try {
    await Class.deleteMany({}); // Clear existing classes
    
    const initialClasses = [
      // MONDAY
      { title: 'Power circuit', time: '7:00 AM', duration: '45 MIN', type: 'HIIT · Studio 02', coach: 'Morgan Lee', availability: '6 spots left', borderColor: '#ea4c2b', day: 'MON', category: 'Class' },
      { title: 'Move & restore', time: '9:00 AM', duration: '60 MIN', type: 'Mobility · Studio 01', coach: 'Sam Rivera', availability: '10 spots left', borderColor: '#7b9e71', day: 'MON', category: 'Class' },
      { title: '1-on-1 Strength', time: '11:00 AM', duration: '60 MIN', type: 'Personal Training', coach: 'Taylor Brooks', availability: '2 slots left', borderColor: '#111', day: 'MON', category: 'Training' },
      { title: 'Strength foundations', time: '6:00 PM', duration: '50 MIN', type: 'Strength · Studio 01', coach: 'Jamie Chen', availability: 'Open', borderColor: '#111', day: 'MON', category: 'Class' },
      
      // TUESDAY
      { title: 'Morning Yoga', time: '8:00 AM', duration: '60 MIN', type: 'Mobility · Studio 01', coach: 'Sam Rivera', availability: '5 spots left', borderColor: '#7b9e71', day: 'TUE', category: 'Class' },
      { title: 'HIIT Blast', time: '5:00 PM', duration: '30 MIN', type: 'HIIT · Studio 02', coach: 'Morgan Lee', availability: 'Open', borderColor: '#ea4c2b', day: 'TUE', category: 'Class' },
      { title: 'Personal Coaching', time: '2:00 PM', duration: '60 MIN', type: '1-on-1 Session', coach: 'Jamie Chen', availability: '1 slot left', borderColor: '#111', day: 'TUE', category: 'Training' },
      
      // WEDNESDAY
      { title: 'Heavy Lift', time: '6:00 PM', duration: '60 MIN', type: 'Strength · Gym floor', coach: 'Taylor Brooks', availability: 'Open', borderColor: '#111', day: 'WED', category: 'Class' }
    ];
    
    await Class.insertMany(initialClasses);
    res.send('Classes added to database successfully! Go check your website.');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error adding classes');
  }
});
// ==========================================

// Start the server
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB successfully!');

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });