import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import About from './components/BasePage';
import Login from './components/Login';
import Signup from './components/Signup';
import Home from './components/Home';
import BMI from './components/BMI';
import BMR from './components/BMR';
import CaloricIntake from './components/CaloricIntake';
import WeightProgress from './components/WeightProgress';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import './style.css';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Navbar />
              <div className="container">
                <Home />
              </div>
              <Footer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bmi"
          element={
            <ProtectedRoute>
              <Navbar />
              <div className="container">
                <BMI />
              </div>
              <Footer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bmr"
          element={
            <ProtectedRoute>
              <Navbar />
              <div className="container">
                <BMR />
              </div>
              <Footer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/caloric-intake"
          element={
            <ProtectedRoute>
              <Navbar />
              <div className="container">
                <CaloricIntake />
              </div>
              <Footer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/weight-progress"
          element={
            <ProtectedRoute>
              <Navbar />
              <div className="container">
                <WeightProgress />
              </div>
              <Footer />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
