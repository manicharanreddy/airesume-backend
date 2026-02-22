import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/globals.css';
import './Auth.css';
import { registerUser } from '../services/api';

const Register = ({ updateUser }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await registerUser({ name, email, password });

      if (response.data) {
        // Store token in localStorage
        localStorage.setItem('token', response.data.token);
        // Store user data correctly from the response
        const userData = {
          _id: response.data._id,
          name: response.data.name,
          email: response.data.email
        };
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Update user state in App component
        if (updateUser) {
          updateUser(userData);
        }
        
        // Redirect to dashboard
        navigate('/dashboard');
      } else {
        setError(response.data?.message || 'Registration failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Registration error:', err);
    }
  };

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Create an Account</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name:</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password:</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="auth-button">Register</button>
        </form>
        <div className="auth-footer">
          <p>Already have an account? <button onClick={handleLoginRedirect} className="link-button">Login</button></p>
        </div>
      </div>
    </div>
  );
};

export default Register;