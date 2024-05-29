import React, { useState, useEffect } from 'react';
import { collection, addDoc, query, getDocs, orderBy } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const WeightProgress = () => {
  const [weight, setWeight] = useState('');
  const [weights, setWeights] = useState([]);
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchWeights = async (uid) => {
      try {
        console.log('Fetching weights for user:', uid);
        const q = query(collection(db, `users/${uid}/weights`), orderBy('timestamp'));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
          console.error('No weight data found for user:', uid);
          setError('No weight data found.');
          return;
        }
        const weightsData = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.timestamp && data.timestamp.toDate) {
            data.timestamp = data.timestamp.toDate(); // Convert Firestore timestamp to JS Date
          }
          console.log('Weight data:', data);
          weightsData.push({ ...data, id: doc.id });
        });
        setWeights(weightsData);
      } catch (e) {
        console.error('Error fetching weights:', e.message);
        setError(`Failed to get weight data. Please check your network connection or permissions. Error: ${e.message}`);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        console.log('User authenticated:', currentUser);
        fetchWeights(currentUser.uid);
      } else {
        console.log('No user authenticated');
      }
    });

    return () => unsubscribe();
  }, []);

  const logWeight = async () => {
    if (!weight || isNaN(weight)) {
      setError('Please enter a valid number for weight');
      return;
    }

    if (user) {
      try {
        const timestamp = new Date();
        const docRef = await addDoc(collection(db, `users/${user.uid}/weights`), {
          userId: user.uid,
          weight: Number(weight),
          timestamp,
        });
        console.log('Weight logged:', { id: docRef.id, weight: Number(weight), timestamp });
        setWeights([...weights, { id: docRef.id, weight: Number(weight), timestamp }]);
        setWeight('');
        setError('');
      } catch (e) {
        console.error('Error adding document: ', e.message);
        setError(`Failed to log weight. Please check your network connection or permissions. Error: ${e.message}`);
      }
    }
  };

  const handleNumericInput = (e) => {
    const charCode = e.which ? e.which : e.keyCode;
    if (charCode < 48 || charCode > 57) {
      e.preventDefault();
    }
  };

  const data = {
    labels: weights.map((entry) => entry.timestamp.toLocaleDateString()),
    datasets: [
      {
        label: 'Weight Progress',
        data: weights.map((entry) => entry.weight),
        fill: false,
        backgroundColor: 'rgba(75,192,192,1)',
        borderColor: 'rgba(75,192,192,1)',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: 'category',
        ticks: {
          autoSkip: true, // Automatically skip ticks to avoid overlap
          maxRotation: 0,
          minRotation: 0,
          maxTicksLimit: 5, // Limit to 5 ticks to show around 5 inputs per scroll
        },
      },
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        display: true,
      },
    },
  };

  return (
    <div className="background">
    <div className="container">
      <div className="login-signup">
        <h2>Track Weight Progress</h2>
        <input
          type="text"
          placeholder="Weight (lbs)"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          onKeyPress={handleNumericInput}
        />
        <button onClick={logWeight}>Log Weight</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <div className="chart-container">
          <Line data={data} options={options} />
        </div>
      </div>
    </div>
    </div>
  );
};

export default WeightProgress;
