
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Classes.css';

const Classes = () => {
  const navigate = useNavigate();

  // Classes and bookings
  const [classesData, setClassesData] = useState([]);
  const [bookedClasses, setBookedClasses] = useState([]);

  // Loading and error states
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Selected day
  const [selectedDay, setSelectedDay] = useState('MON');

  // Booking state
  const [bookingId, setBookingId] = useState(null);

  // API base URL
  const API_URL = process.env.REACT_APP_API_URL;

  // Get logged-in user
  const getUserInfo = () => {
    try {
      return JSON.parse(localStorage.getItem('user'));
    } catch (error) {
      console.error('Invalid user information:', error);
      return null;
    }
  };

  // Fetch classes and bookings
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError('');

      try {
        if (!API_URL) {
          throw new Error('API URL is not configured.');
        }

        const user = getUserInfo();

        // Fetch all classes
        const classRes = await fetch(
          `${API_URL}/api/classes`
        );

        if (!classRes.ok) {
          throw new Error('Unable to load classes.');
        }

        const classData = await classRes.json();

        setClassesData(
          Array.isArray(classData) ? classData : []
        );

        // Fetch user bookings
        if (user?.token) {
          const bookRes = await fetch(
            `${API_URL}/api/bookings`,
            {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            }
          );

          if (!bookRes.ok) {
            throw new Error('Unable to load your bookings.');
          }

          const bookData = await bookRes.json();

          setBookedClasses(
            Array.isArray(bookData) ? bookData : []
          );
        } else {
          setBookedClasses([]);
        }

      } catch (error) {
        console.error('Error fetching classes:', error);
        setError(error.message || 'Something went wrong.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [API_URL]);

  // Days of the week
  const days = [
    { day: 'MON', date: '16' },
    { day: 'TUE', date: '17' },
    { day: 'WED', date: '18' },
    { day: 'THU', date: '19' },
    { day: 'FRI', date: '20' },
    { day: 'SAT', date: '21' },
    { day: 'SUN', date: '22' },
  ];

  // Filter classes according to selected day
  const filteredClasses = classesData.filter(
    (cls) => cls.day === selectedDay
  );

  // Handle booking
  const handleBooking = async (cls) => {
    const user = getUserInfo();

    if (!user?.token) {
      alert('Please log in to book a class.');
      navigate('/login');
      return;
    }

    if (bookingId) return;

    setBookingId(cls._id || cls.id || cls.title);

    try {
      const selectedDate = days.find(
        (d) => d.day === selectedDay
      );

      const response = await fetch(
        `${API_URL}/api/bookings`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({
            className: cls.title,
            time: cls.time,
            date: `Nov ${selectedDate.date}, 2026`,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Booking failed.');
      }

      setBookedClasses((prev) => [...prev, data]);

      alert('Your class has been booked successfully!');

    } catch (error) {
      console.error('Booking error:', error);
      alert(error.message || 'Error booking class.');
    } finally {
      setBookingId(null);
    }
  };

  return (
    <div className="classes-page">
      <div className="classes-container">

        {/* Page Header */}
        <div className="classes-header">
          <div>
            <p className="eyebrow">
              FIND YOUR NEXT GOOD HOUR
            </p>

            <h1 className="classes-title">
              Your pace. Your people.
            </h1>

            <p className="classes-subtitle">
              Strength, energy, or a moment to reset.
              There's a class for that.
            </p>
          </div>
        </div>

        {/* Days Selector */}
        <div className="days-row">
          {days.map((d) => (
            <div
              className={`day-card ${
                selectedDay === d.day ? 'active' : ''
              }`}
              key={d.day}
              onClick={() => setSelectedDay(d.day)}
              style={{ cursor: 'pointer' }}
            >
              <span className="day-name">
                {d.day}
              </span>

              <span className="day-date">
                {d.date}
              </span>

              {selectedDay === d.day && (
                <span className="today-label">
                  SELECTED
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Table Header */}
        <div className="table-header">
          <span className="col-time">TIME</span>
          <span className="col-class">CLASS</span>
          <span className="col-coach">COACH</span>
          <span className="col-avail">AVAILABILITY</span>
          <span className="col-action"></span>
        </div>

        {/* Classes List */}
        <div className="classes-list">

          {isLoading ? (
            <p style={{ padding: '20px' }}>
              Loading classes...
            </p>

          ) : error ? (
            <div style={{ padding: '20px', color: 'red' }}>
              {error}
            </div>

          ) : filteredClasses.length === 0 ? (
            <p style={{ padding: '20px', color: '#888' }}>
              No classes scheduled for this day yet.
            </p>

          ) : (
            filteredClasses.map((cls, index) => {

              const isBooked = bookedClasses.some(
                (b) =>
                  b.className === cls.title &&
                  b.date === `Nov ${
                    days.find((d) => d.day === selectedDay)?.date
                  }, 2026`
              );

              const currentBookingId =
                cls._id || cls.id || cls.title;

              const isBooking = bookingId === currentBookingId;

              return (
                <div
                  className="class-row"
                  key={cls._id || cls.id || index}
                >

                  <div
                    className="border-stripe"
                    style={{
                      backgroundColor: cls.borderColor || '#222',
                    }}
                  />

                  {/* Time */}
                  <div className="col-time">
                    <p className="time-val">
                      {cls.time}
                    </p>

                    <p className="duration-val">
                      {cls.duration}
                    </p>
                  </div>

                  {/* Class */}
                  <div className="col-class">
                    <p className="class-title">
                      {cls.title}
                    </p>

                    <p className="class-type">
                      {cls.type}
                    </p>
                  </div>

                  {/* Coach */}
                  <div className="col-coach">
                    <p>{cls.coach}</p>
                  </div>

                  {/* Availability */}
                  <div className="col-avail">
                    <p>
                      {isBooked
                        ? "You're booked"
                        : cls.availability}
                    </p>
                  </div>

                  {/* Booking Button */}
                  <div className="col-action">
                    <button
                      className={`btn-action ${
                        isBooked
                          ? 'booked'
                          : cls.availability === 'Class full'
                          ? 'disabled'
                          : 'available'
                      }`}
                      onClick={() => {
                        if (isBooked) {
                          alert('You have already booked this class.');
                        } else if (
                          cls.availability !== 'Class full'
                        ) {
                          handleBooking(cls);
                        }
                      }}
                      disabled={
                        isBooked ||
                        cls.availability === 'Class full' ||
                        isBooking
                      }
                    >
                      {isBooking
                        ? 'Booking...'
                        : isBooked
                        ? 'View booking'
                        : cls.availability === 'Class full'
                        ? 'Join waitlist'
                        : 'Book class'}
                    </button>
                  </div>

                </div>
              );
            })
          )}

        </div>
      </div>
    </div>
  );
};

export default Classes;
