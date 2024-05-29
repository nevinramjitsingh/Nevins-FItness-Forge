import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';

const BMR = () => {
  const [weight, setWeight] = useState('');
  const [heightFeet, setHeightFeet] = useState('');
  const [heightInches, setHeightInches] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('male');
  const [bmr, setBmr] = useState(null);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          if (userData.bmr) {
            setBmr(userData.bmr);
          }
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const calculateBMR = async () => {
    if (!weight || !heightFeet || !heightInches || !age) {
      setError('All fields are required');
      return;
    }
    if (isNaN(weight) || isNaN(heightFeet) || isNaN(heightInches) || isNaN(age)) {
      setError('Please enter valid numbers');
      return;
    }

    const height = parseInt(heightFeet) * 12 + parseInt(heightInches);
    let bmrValue;
    if (gender === 'male') {
      bmrValue = 66 + 6.23 * parseFloat(weight) + 12.7 * height - 6.8 * parseFloat(age);
    } else {
      bmrValue = 655 + 4.35 * parseFloat(weight) + 4.7 * height - 4.7 * parseFloat(age);
    }
    setBmr(bmrValue.toFixed(2));

    if (user) {
      await setDoc(doc(db, 'users', user.uid), { bmr: bmrValue }, { merge: true });
    }
    setError('');
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
        <h2>Calculate BMR</h2>
        <input
          type="text"
          placeholder="Weight (lbs)"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          onKeyPress={handleNumericInput}
        />
        <input
          type="text"
          placeholder="Height (feet)"
          value={heightFeet}
          onChange={(e) => setHeightFeet(e.target.value)}
          onKeyPress={handleNumericInput}
        />
        <input
          type="text"
          placeholder="Height (inches)"
          value={heightInches}
          onChange={(e) => setHeightInches(e.target.value)}
          onKeyPress={handleNumericInput}
        />
        <input
          type="text"
          placeholder="Age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          onKeyPress={handleNumericInput}
        />
        <select value={gender} onChange={(e) => setGender(e.target.value)}>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        <button onClick={calculateBMR}>Calculate</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {bmr && (
          <div>
            <p>Your BMR is: {bmr}</p>
            <p>To cut: {(bmr * 0.8).toFixed(2)} calories/day</p>
            <p>To maintain: {bmr} calories/day</p>
            <p>To bulk: {(bmr * 1.2).toFixed(2)} calories/day</p>
          </div>
        )}
      </div>
    </div>
    </div>
  );
};

export default BMR;
