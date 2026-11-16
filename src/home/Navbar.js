import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  
  // Check if a user is logged in
  const userInfo = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('user'); // Clear the token
    navigate('/login'); // Send them back to login
    window.location.reload(); // Refresh to update the navbar
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-left">
          <Link to="/" className="navbar-logo">
            forma <span>TRAINING CLUB</span>
          </Link>
        </div>

        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/" className="nav-link">Home</Link>
          </li>
          <li className="nav-item">
            <Link to="/dashboard" className="nav-link">Dashboard</Link>
          </li>
          <li className="nav-item">
            <Link to="/classes" className="nav-link">Classes</Link>
          </li>
        </ul>

        <div className="navbar-right">
          <span className="nav-location">PORTLAND, OR</span>
          
          {/* If logged in, show name and Logout */}
          {userInfo ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>
                Hi, {userInfo.name.split(' ')[0]}
              </span>
              <button 
                onClick={handleLogout}
                style={{ 
                  background: 'transparent', 
                  border: '1px solid #ea4c2b', 
                  color: '#ea4c2b', 
                  padding: '8px 16px', 
                  borderRadius: '4px', 
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                Logout
              </button>
            </div>
          ) : (
            /* If not logged in, show Join button */
            <Link to="/register" className="btn-join-nav">
              Join the club <i className="fas fa-arrow-up-right-from-square"></i>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;