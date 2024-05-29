import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setMessage('Login successful!');
      navigate('/home');
    } catch (error) {
      setMessage('Error: ' + error.message);
    }
  };

  return (
    <div className="container">
      <div className="login-signup">
      <img src="/icon1.png" alt="Icon" className="icon" />
        <h2>Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>Login</button>
        <a href="/signup">Don't have an account? Sign up</a>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default Login;
