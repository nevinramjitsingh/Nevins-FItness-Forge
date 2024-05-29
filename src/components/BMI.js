import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import BMIMeter from './BMIMeter';

const BMI = () => {
  const [weight, setWeight] = useState('');
  const [heightFeet, setHeightFeet] = useState('');
  const [heightInches, setHeightInches] = useState('');
  const [bmi, setBmi] = useState(null);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          if (userData.bmi) {
            const bmiValue = Number(userData.bmi);
            setBmi(bmiValue.toFixed(2)); // Ensure value is set with two decimal points
            setStatus(getBMICategory(bmiValue));
          }
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const calculateBMI = async () => {
    if (!weight || !heightFeet || !heightInches) {
      setError('All fields are required');
      return;
    }
    if (isNaN(weight) || isNaN(heightFeet) || isNaN(heightInches)) {
      setError('Please enter valid numbers');
      return;
    }

    const height = parseInt(heightFeet) * 12 + parseInt(heightInches);
    const bmiValue = (parseInt(weight) / (height * height)) * 703;
    const formattedBmi = bmiValue.toFixed(2);
    setBmi(formattedBmi); // Use formatted value
    const bmiCategory = getBMICategory(bmiValue);
    setStatus(bmiCategory);

    if (user) {
      await setDoc(doc(db, 'users', user.uid), { bmi: formattedBmi, bmiStatus: bmiCategory }, { merge: true });
    }
    setError('');
  };

  const getBMICategory = (bmiValue) => {
    if (bmiValue < 18.5) {
      return 'Underweight';
    } else if (bmiValue >= 18.5 && bmiValue < 24.9) {
      return 'Normal weight';
    } else if (bmiValue >= 25 && bmiValue < 29.9) {
      return 'Overweight';
    } else {
      return 'Obesity';
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
        <h2>Calculate BMI</h2>
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
        <button onClick={calculateBMI}>Calculate</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {bmi && (
          <div>
            <p>Your BMI is: {bmi}</p>
            <p>Status: {status}</p>
            <BMIMeter bmi={bmi} />
          </div>
        )}
      </div>
    </div>
    </div>
  );
};

export default BMI;
