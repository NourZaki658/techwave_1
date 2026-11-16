const Booking = require('../models/Booking');

const createBooking = async (req, res) => {
  const { className, time, date } = req.body;
  if (!className || !time || !date) {
    return res.status(400).json({ message: 'Please add all fields' });
  }
  const booking = await Booking.create({
    user: req.user.id,
    className,
    time,
    date,
  });
  res.status(201).json(booking);
};

const getBookings = async (req, res) => {
  const bookings = await Booking.find({ user: req.user.id });
  res.status(200).json(bookings);
};

module.exports = { createBooking, getBookings };