import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('user'));

    if (!userInfo || !userInfo.token) {
      navigate('/login');
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/auth/me', {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          setUserData(data);
        } else {
          localStorage.removeItem('user');
          navigate('/login');
        }
      } catch (error) {
        console.error('Error fetching user data', error);
      }
    };

    fetchUserData();
  }, [navigate]);

  if (!userData) {
    return <div style={{ padding: '50px', textAlign: 'center' }}>Loading your dashboard...</div>;
  }

  // Extract real data
  const firstName = userData.user.name.split(' ')[0];
  const stats = userData.stats;
  const nextBooking = userData.nextBooking;
  const recentBookings = userData.recentBookings;

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        
        {/* Header Section */}
        <div className="dash-header">
          <div>
            <p className="eyebrow">YOUR SPACE TO GROW</p>
            <h1 className="dash-title">Let's keep moving, {firstName}.</h1>
            <p className="dash-subtitle">A fresh week. A little more progress. You've got this.</p>
          </div>
          <div className="dash-header-right">
            <p className="dash-date">MONDAY, NOVEMBER 16</p>
            <Link to="/classes" className="btn-primary" style={{ textDecoration: 'none' }}>
              Book a class <i className="fas fa-arrow-up-right-from-square"></i>
            </Link>
          </div>
        </div>

        {/* Stats Grid (Dynamic) */}
        <div className="stats-grid">
          <div className="stat-box">
            <p className="stat-label">Workouts this month</p>
            <h2 className="stat-value">{stats.workoutsThisMonth}</h2>
            <p className="stat-trend"><i className="fas fa-arrow-up"></i> Keep it up!</p>
          </div>
          <div className="stat-box">
            <p className="stat-label">Training time</p>
            <h2 className="stat-value">{stats.trainingTime}</h2>
            <p className="stat-desc">hours this month</p>
          </div>
          <div className="stat-box">
            <p className="stat-label">Current streak</p>
            <h2 className="stat-value">{stats.streak}</h2>
            <p className="stat-desc">weeks of showing up</p>
          </div>
          <div className="stat-box">
            <p className="stat-label">Monthly goal</p>
            <h2 className="stat-value">{stats.workoutsThisMonth} <span>/ {stats.goal}</span></h2>
            <p className="stat-desc">
              {Math.round((stats.workoutsThisMonth / stats.goal) * 100)}% of the way there
            </p>
          </div>
        </div>

        {/* Middle Section: Chart & Up Next */}
        <div className="middle-grid">
          
          {/* Chart Box */}
          <div className="chart-box">
            <div className="chart-header">
              <div>
                <h3 className="box-title">Your weekly rhythm</h3>
                <p className="box-subtitle">Training time in minutes</p>
              </div>
              <select className="chart-select">
                <option>This week</option>
              </select>
            </div>
            
            {/* Bar Chart (Static for now) */}
            <div className="chart-area">
              <div className="y-axis">
                <span>60</span>
                <span>30</span>
                <span>0</span>
              </div>
              <div className="bars-container">
                <div className="bar-col"><div className="bar active" style={{ height: '45%' }}></div><span>Mon</span></div>
                <div className="bar-col"><div className="bar" style={{ height: '0%' }}></div><span>Tue</span></div>
                <div className="bar-col"><div className="bar" style={{ height: '5%' }}></div><span>Wed</span></div>
                <div className="bar-col"><div className="bar" style={{ height: '60%' }}></div><span>Thu</span></div>
                <div className="bar-col"><div className="bar" style={{ height: '35%' }}></div><span>Fri</span></div>
                <div className="bar-col"><div className="bar" style={{ height: '60%' }}></div><span>Sat</span></div>
                <div className="bar-col"><div className="bar" style={{ height: '0%' }}></div><span>Sun</span></div>
              </div>
            </div>
          </div>

          {/* Up Next Box (Dynamic) */}
          <div className="up-next-box">
            <div className="up-next-header">
              <p className="eyebrow">UP NEXT</p>
              {nextBooking && <span className="badge-status">Confirmed</span>}
            </div>
            
            {nextBooking ? (
              <>
                <h2 className="up-next-title">{nextBooking.className}</h2>
                <p className="up-next-desc">Get ready to sweat.</p>
                <div className="up-next-details">
                  <p className="date-time">{nextBooking.date}</p>
                  <p className="big-time">{nextBooking.time}</p>
                  <p className="coach">Studio 01</p>
                </div>
                <Link to="/classes" className="view-booking-link">View booking <i className="fas fa-arrow-right"></i></Link>
              </>
            ) : (
              <>
                <h2 className="up-next-title">No upcoming classes</h2>
                <p className="up-next-desc">You haven't booked anything yet.</p>
                <Link to="/classes" className="btn-primary" style={{ marginTop: '20px', display: 'inline-block', textAlign: 'center', textDecoration: 'none' }}>
                  Book a class
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Bottom Section: Recent Activity & Membership */}
        <div className="bottom-grid">
          
          {/* Recent Activity (Dynamic) */}
          <div className="recent-box">
            <div className="recent-header">
              <h3 className="box-title">Good work, recently.</h3>
              <Link to="/classes" className="view-all-link">View all <i className="fas fa-arrow-right"></i></Link>
            </div>
            <table className="recent-table">
              <thead>
                <tr>
                  <th>SESSION</th>
                  <th>DATE</th>
                  <th>DURATION</th>
                  <th>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.length > 0 ? (
                  recentBookings.map((booking, idx) => (
                    <tr key={idx}>
                      <td className="session-name">{booking.className}</td>
                      <td>{booking.date}</td>
                      <td>50 min</td>
                      <td>Booked</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', padding: '20px', color: '#888' }}>
                      No recent activity yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Membership Box (Dynamic) */}
          <div className="membership-box">
            <p className="eyebrow">YOUR MEMBERSHIP</p>
            <h2 className="membership-title">{userData.user.membership}</h2>
            <p className="membership-desc">More movement. More possibilities.</p>
            
            <div className="membership-footer">
              <p className="next-payment">Next payment · Dec 1</p>
              <p className="price">$79 <span>/ month</span></p>
            </div>
            <a href="#manage" className="manage-link">Manage membership <i className="fas fa-arrow-right"></i></a>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;