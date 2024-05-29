import React from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  return (
    <div className="navbar">
      <div className="navbar-left">
        <img src="/custom-favicon.ico" alt="Logo" className="logo" />
        <span className="site-name">Nevin's Fitness Forge</span>
      </div>
      <div className="navbar-right">
          <a href="/home" className="home-button">
          Home
          </a>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;
