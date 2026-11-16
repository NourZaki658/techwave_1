import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home">
      
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <p className="eyebrow">MOVE WITH PURPOSE.</p>
            <h1 className="hero-title">Build strength.<br />Find your people.</h1>
            <p className="hero-description">
              Good training. Real connection. A space to become<br />
              a stronger version of yourself, one session at a time.
            </p>
            
            <div className="hero-buttons">
              <Link to="/membership" className="btn-primary">
                Find your membership <i className="fas fa-arrow-up-right-from-square"></i>
              </Link>
              <Link to="/classes" className="btn-text">
                Explore classes <i className="fas fa-arrow-right"></i>
              </Link>
            </div>

            <div className="hero-note">
              <p className="note-title">More than a gym. Your daily reset.</p>
              <p className="note-text">Expert coaches · Small-group classes · All levels welcome</p>
            </div>
          </div>

          <div className="hero-image-wrapper">
            <img 
              src="https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=1000" 
              alt="Woman training with kettlebell" 
              className="hero-image"
            />
            <div className="hero-image-card">
              <p className="card-eyebrow">SHOW UP AS YOU ARE.</p>
              <p className="card-text">We'll meet you there. <i className="fas fa-arrow-up-right-from-square"></i></p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Strip */}
      <section className="features-strip">
        <div className="features-container">
          <div className="feature-item">
            <span className="feature-number">01</span>
            <div>
              <h4 className="feature-title">Expert-led, always</h4>
              <p className="feature-desc">Coaching that meets you at your level.</p>
            </div>
          </div>
          <div className="feature-item">
            <span className="feature-number">02</span>
            <div>
              <h4 className="feature-title">Better together</h4>
              <p className="feature-desc">A community that keeps you coming back.</p>
            </div>
          </div>
          <div className="feature-item">
            <span className="feature-number">03</span>
            <div>
              <h4 className="feature-title">Built around you</h4>
              <p className="feature-desc">Train your way, on your schedule.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Membership Section */}
      <section className="membership-section">
        <div className="membership-container">
          <div className="membership-header">
            <p className="eyebrow">YOUR ROUTINE STARTS HERE</p>
            <h2 className="section-title">A membership that fits.</h2>
            <p className="section-subtitle">No joining fees. No long-term contracts. Just progress.</p>
          </div>

          <div className="pricing-grid">
            {/* Card 1 */}
            <div className="pricing-card">
              <h3 className="plan-name">Open gym</h3>
              <div className="plan-price">
                <span className="currency">$</span>39 <span className="period">/ month</span>
              </div>
              <p className="plan-desc">For your own kind of training.</p>
              <ul className="plan-features">
                <li><i className="fas fa-check"></i> Full gym access</li>
                <li><i className="fas fa-check"></i> Open daily, 5am–11pm</li>
              </ul>
              <button className="btn-plan btn-dark">Start with Open gym</button>
            </div>

            {/* Card 2 - Highlighted */}
            <div className="pricing-card highlight">
              <div className="plan-header">
                <h3 className="plan-name">Club unlimited</h3>
                <span className="badge">MOST POPULAR</span>
              </div>
              <div className="plan-price">
                <span className="currency">$</span>79 <span className="period">/ month</span>
              </div>
              <p className="plan-desc">A little structure. A lot of possibility.</p>
              <ul className="plan-features">
                <li><i className="fas fa-check"></i> Unlimited group classes</li>
                <li><i className="fas fa-check"></i> Full gym access + coaching</li>
              </ul>
              <button className="btn-plan btn-primary">Join Club unlimited</button>
            </div>

            {/* Card 3 */}
            <div className="pricing-card">
              <h3 className="plan-name">Personal coaching</h3>
              <div className="plan-price">
                <span className="currency">$</span>149 <span className="period">/ month</span>
              </div>
              <p className="plan-desc">A plan with your name on it.</p>
              <ul className="plan-features">
                <li><i className="fas fa-check"></i> 4 personal sessions / month</li>
                <li><i className="fas fa-check"></i> Everything in Club unlimited</li>
              </ul>
              <button className="btn-plan btn-dark">Explore personal coaching</button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-brand">
            <h2 className="footer-logo">forma</h2>
            <span className="footer-tagline">A little stronger. Every day.</span>
          </div>
          <div className="footer-links">
            <a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram <i className="fas fa-arrow-up-right-from-square"></i></a>
            <a href="/contact">Contact</a>
          </div>
          <div className="footer-copyright">
            © 2026 Forma
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;