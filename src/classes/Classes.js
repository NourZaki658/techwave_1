import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Classes.css';

const Classes = () => {
  const navigate = useNavigate();
  const [classesData, setClassesData] = useState([]);
  const [bookedClasses, setBookedClasses] = useState([]);
const [isLoading] = useState(true);
  
  // NEW: State to keep track of which day is selected
  const [selectedDay, setSelectedDay] = useState('MON'); 

  const userInfo = JSON.parse(localStorage.getItem('user'));

useEffect(() => {
  const fetchData = async () => {
    try {
      const classRes = await fetch(
        `${process.env.REACT_APP_API_URL}/api/classes`
      );
      const classData = await classRes.json();
      setClassesData(classData);

      if (userInfo) {
        const bookRes = await fetch(
          `${process.env.REACT_APP_API_URL}/api/bookings`,
          {
            headers: {
              Authorization: `Bearer ${userInfo.token}`,
            },
          }
        );

        const bookData = await bookRes.json();
        setBookedClasses(bookData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  fetchData();
}, [userInfo]);

  const handleBooking = async (cls) => {
    if (!userInfo) {
      alert("Please log in to book a class.");
      navigate('/login');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify({
          className: cls.title,
          time: cls.time,
          date: `Nov ${selectedDay === 'MON' ? '16' : selectedDay === 'TUE' ? '17' : '18'}, 2026`, // Dynamic date based on day
        }),
      });

      if (response.ok) {
        const newBooking = await response.json();
        setBookedClasses([...bookedClasses, newBooking]);
      }
    } catch (error) {
      alert("Error booking class");
    }
  };

  const days = [
    { day: 'MON', date: '16' },
    { day: 'TUE', date: '17' },
    { day: 'WED', date: '18' },
    { day: 'THU', date: '19' },
    { day: 'FRI', date: '20' },
    { day: 'SAT', date: '21' },
    { day: 'SUN', date: '22' },
  ];

  // NEW: Filter the classes to only show the selected day
  const filteredClasses = classesData.filter(cls => cls.day === selectedDay);

  return (
    <div className="classes-page">
      <div className="classes-container">
        
        <div className="classes-header">
          <div>
            <p className="eyebrow">FIND YOUR NEXT GOOD HOUR</p>
            <h1 className="classes-title">Your pace. Your people.</h1>
            <p className="classes-subtitle">Strength, energy, or a moment to reset. There's a class for that.</p>
          </div>
        </div>

        {/* Clickable Days Row */}
        <div className="days-row">
          {days.map((d, index) => (
            <div 
              className={`day-card ${selectedDay === d.day ? 'active' : ''}`} 
              key={index}
              onClick={() => setSelectedDay(d.day)} // <-- Makes it clickable
              style={{ cursor: 'pointer' }}
            >
              <span className="day-name">{d.day}</span>
              <span className="day-date">{d.date}</span>
              {selectedDay === d.day && <span className="today-label">SELECTED</span>}
            </div>
          ))}
        </div>

        <div className="table-header">
          <span className="col-time">TIME</span>
          <span className="col-class">CLASS</span>
          <span className="col-coach">COACH</span>
          <span className="col-avail">AVAILABILITY</span>
          <span className="col-action"></span>
        </div>

        <div className="classes-list">
          {isLoading ? (
            <p style={{ padding: '20px' }}>Loading classes...</p>
          ) : filteredClasses.length === 0 ? (
            <p style={{ padding: '20px', color: '#888' }}>
              No classes scheduled for this day yet.
            </p>
          ) : (
            filteredClasses.map((cls, index) => {
              const isBooked = bookedClasses.some(b => b.className === cls.title);
              
              return (
                <div className="class-row" key={index}>
                  <div className="border-stripe" style={{ backgroundColor: cls.borderColor }}></div>
                  
                  <div className="col-time">
                    <p className="time-val">{cls.time}</p>
                    <p className="duration-val">{cls.duration}</p>
                  </div>
                  
                  <div className="col-class">
                    <p className="class-title">{cls.title}</p>
                    <p className="class-type">{cls.type}</p>
                  </div>
                  
                  <div className="col-coach">
                    <p>{cls.coach}</p>
                  </div>
                  
                  <div className="col-avail">
                    <p>{isBooked ? "You're booked" : cls.availability}</p>
                  </div>
                  
                  <div className="col-action">
                    <button 
                      className={`btn-action ${isBooked ? 'booked' : (cls.availability === 'Class full' ? 'disabled' : 'available')}`}
                      onClick={() => {
                        if (isBooked) alert("Already booked!");
                        else if (cls.availability !== 'Class full') handleBooking(cls);
                      }}
                      disabled={cls.availability === 'Class full'}
                    >
                      {isBooked ? 'View booking' : (cls.availability === 'Class full' ? 'Join waitlist' : 'Book class')}
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