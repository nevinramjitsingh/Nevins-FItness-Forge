import React from 'react';
import { Link } from 'react-router-dom';
import './BasePage.css';

const BasePage = () => {
  return (
    <div className="base-container">
      <header className="hero-section">
        <img src="/logo.png" alt="Logo" className="hero-logo" />
        <h1>Nevin's Fitness Forge</h1>
        <p>Your one-stop destination for tracking your fitness journey.</p>
      </header>
      <main className="content-section">
        <div className="about-section">
          <h2>About Us</h2>
          <p>
            Welcome to Nevin's Fitness Forge! We are dedicated to helping you achieve your fitness goals by providing tools to track your progress, calculate your BMI and BMR, and manage your daily caloric intake.
          </p>
        </div>
        <div className="navigation-links">
          <Link to="/login" className="login-button">Login</Link>
          <Link to="/signup" className="signup-button">Signup</Link>
        </div>
      </main>
    </div>
  );
};

export default BasePage;
