import React, { useState, useEffect, useCallback } from 'react';
import { collection, addDoc, doc, setDoc, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import ProgressBar from './ProgressBar';

const CaloricIntake = () => {
  const [calories, setCalories] = useState('');
  const [goal, setGoal] = useState('maintain'); // Default value
  const [dailyIntake, setDailyIntake] = useState(0);
  const [remainingCalories, setRemainingCalories] = useState(2000);
  const [totalCalories, setTotalCalories] = useState(2000); // Default value
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  const fetchBMR = useCallback(async (uid) => {
    try {
      console.log('Fetching BMR for user:', uid);
      const bmrDoc = await getDoc(doc(db, 'users', uid));
      if (!bmrDoc.exists()) {
        console.error('No BMR data found for user:', uid);
        setError('No BMR data found.');
        return;
      }
      const data = bmrDoc.data();
      console.log('BMR data fetched:', data);
      const bmrValue =
        goal === 'cut' ? data.bmr * 0.8 : goal === 'bulk' ? data.bmr * 1.2 : data.bmr;
      console.log(`Setting totalCalories to ${bmrValue} for goal ${goal}`);
      setTotalCalories(bmrValue);
      setRemainingCalories(bmrValue - dailyIntake); // Update remaining calories
    } catch (error) {
      console.error('Error fetching BMR data:', error);
      setError('Failed to get BMR data. Please check your network connection or permissions.');
    }
  }, [goal, dailyIntake]);

  const fetchUserData = useCallback(async (currentUser) => {
    if (currentUser) {
      setUser(currentUser);
      console.log('User authenticated:', currentUser);
      await fetchBMR(currentUser.uid);

      const today = new Date().toLocaleDateString();
      try {
        console.log('Fetching daily intake data for user:', currentUser.uid);
        const dailyIntakeDoc = await getDoc(doc(db, 'dailyIntake', currentUser.uid));
        if (dailyIntakeDoc.exists()) {
          const data = dailyIntakeDoc.data();
          console.log('Daily intake data fetched:', data);
          if (data.date === today) {
            setDailyIntake(data.intake);
            setRemainingCalories(totalCalories - data.intake);
          } else {
            console.log('Resetting daily intake for a new day');
            await setDoc(doc(db, 'dailyIntake', currentUser.uid), { intake: 0, date: today });
            setDailyIntake(0);
            setRemainingCalories(totalCalories);
          }
        } else {
          console.log('No daily intake data found, setting initial value');
          await setDoc(doc(db, 'dailyIntake', currentUser.uid), { intake: 0, date: today });
          setDailyIntake(0);
          setRemainingCalories(totalCalories);
        }
      } catch (error) {
        console.error('Error fetching daily intake data:', error);
        setError('Failed to get daily intake data. Please check your network connection or permissions.');
      }
    } else {
      console.log('No user authenticated');
    }
  }, [fetchBMR, totalCalories]);

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        fetchUserData(currentUser);
      }
    });
  }, [fetchUserData]);

  useEffect(() => {
    if (user) {
      fetchBMR(user.uid);
    }
  }, [goal, user, fetchBMR]);

  useEffect(() => {
    setRemainingCalories(totalCalories - dailyIntake);
  }, [dailyIntake, totalCalories]);

  const logCalories = async () => {
    if (!calories || isNaN(calories)) {
      setError('Please enter a valid number for calories');
      return;
    }
    const newIntake = dailyIntake + Number(calories);
    setDailyIntake(newIntake);
    setCalories('');
    setError('');

    if (user) {
      try {
        console.log('Logging calories:', calories);
        await setDoc(doc(db, 'dailyIntake', user.uid), { intake: newIntake, date: new Date().toLocaleDateString() });
        await addDoc(collection(db, 'caloricIntake'), {
          userId: user.uid,
          calories: Number(calories),
          goal,
          timestamp: new Date(),
        });
        console.log('Calories logged successfully');
      } catch (e) {
        console.error('Error adding document:', e);
        setError('Failed to log calories. Please check your network connection or permissions.');
      }
    }
  };

  const handleNumericInput = (e) => {
    const charCode = e.which ? e.which : e.keyCode;
    if (charCode < 48 || charCode > 57) {
      e.preventDefault();
    }
  };

  return (
    <div className="background">
    <div className="container">
      <div className="login-signup">
        <h2>Track Caloric Intake</h2>
        {!isOnline && <p style={{ color: 'red' }}>You are currently offline. Some features may not work.</p>}
        <select value={goal} onChange={(e) => setGoal(e.target.value)}>
          <option value="maintain">Maintain</option>
          <option value="cut">Cut</option>
          <option value="bulk">Bulk</option>
        </select>
        <input
          type="text"
          placeholder="Calories"
          value={calories}
          onChange={(e) => setCalories(e.target.value)}
          onKeyPress={handleNumericInput}
        />
        <button onClick={logCalories}>Log Calories</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <p>Daily Intake: {dailyIntake.toFixed(2)} kcal</p>
        <p>Remaining Calories: {remainingCalories.toFixed(2)} kcal</p>
        <ProgressBar value={dailyIntake} max={totalCalories} />
      </div>
    </div>
    </div>
  );
};

export default CaloricIntake;
