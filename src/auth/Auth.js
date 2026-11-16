import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Auth.css';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  // State for form fields
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const { name, email, password } = formData;

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    // The URL changes based on whether we are logging in or registering
const url = isLogin
  ? `${process.env.REACT_APP_API_URL}/api/auth/login`
  : `${process.env.REACT_APP_API_URL}/api/auth/register`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Save the token to localStorage
        localStorage.setItem('user', JSON.stringify(data));
        // Redirect to dashboard
        navigate('/dashboard');
      } else {
        alert(data.message); // Show error (e.g. "Invalid credentials")
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong. Is the backend running?');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        
        <div className="auth-image-side">
          <img 
            src="https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=800" 
            alt="Gym training" 
            className="auth-bg-image"
          />
          <div className="auth-overlay">
            <h2 className="auth-quote">"The only bad workout is the one that didn't happen."</h2>
            <p className="auth-brand">FORMA TRAINING CLUB</p>
          </div>
        </div>

        <div className="auth-form-side">
          <div className="auth-form-wrapper">
            
            <div className="auth-header">
              <h1 className="auth-title">
                {isLogin ? 'Welcome back.' : 'Join the club.'}
              </h1>
              <p className="auth-subtitle">
                {isLogin 
                  ? 'Enter your details to access your dashboard.' 
                  : 'Start your journey to a stronger you today.'}
              </p>
            </div>

            <form className="auth-form" onSubmit={onSubmit}>
              
              {!isLogin && (
                <div className="input-group">
                  <label>Full Name</label>
                  <input 
                    type="text" 
                    name="name"
                    value={name}
                    onChange={onChange}
                    placeholder="Alex Smith" 
                    required 
                  />
                </div>
              )}

              <div className="input-group">
                <label>Email Address</label>
                <input 
                  type="email" 
                  name="email"
                  value={email}
                  onChange={onChange}
                  placeholder="alex@example.com" 
                  required 
                />
              </div>

              <div className="input-group">
                <label>Password</label>
                <input 
                  type="password" 
                  name="password"
                  value={password}
                  onChange={onChange}
                  placeholder="••••••••" 
                  required 
                />
              </div>

              <button type="submit" className="btn-auth-submit">
                {isLogin ? 'Log In' : 'Create Account'} <i className="fas fa-arrow-right"></i>
              </button>
            </form>

            <div className="auth-footer">
              <p>
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button 
                  type="button"
                  className="toggle-btn" 
                  onClick={() => setIsLogin(!isLogin)}
                >
                  {isLogin ? 'Join the club' : 'Log in'}
                </button>
              </p>
              <Link to="/" className="back-home">
                &larr; Back to home
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;