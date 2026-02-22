import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/globals.css';
import './Auth.css';
import { loginUser } from '../services/api';

const Login = ({ updateUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await loginUser({ email, password });

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
        setError(response.data?.message || 'Login failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Login error:', err);
    }
  };

  const handleRegisterRedirect = () => {
    navigate('/register');
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Login to Your Account</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
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
          <button type="submit" className="auth-button">Login</button>
        </form>
        <div className="auth-footer">
          <p>Don't have an account? <button onClick={handleRegisterRedirect} className="link-button">Register</button></p>
        </div>
      </div>
    </div>
  );
};

export default Login;