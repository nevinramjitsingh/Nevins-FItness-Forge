import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const Home = () => {
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        console.log('User authenticated:', currentUser);
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          console.log('User data:', userData);
          setUserName(userData.name);
        } else {
          console.log('No user data found for:', currentUser.uid);
        }
      } else {
        console.log('No user authenticated');
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="background">
    <div className="container">
      <div className="home-content">
      <img src="/icon2.png" alt="Icon" className="icon" />
        <h2>Welcome, {userName}!</h2>
        <div className="dashboard-links">
          <a href="/bmi">Calculate BMI</a>
          <a href="/bmr">Calculate BMR</a>
          <a href="/caloric-intake">Track Caloric Intake</a>
          <a href="/weight-progress">Track Weight Progress</a>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Home;
