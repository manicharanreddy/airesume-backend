import axios from 'axios';

// Determine the API base URL based on environment
let API_BASE_URL;
if (process.env.NODE_ENV === 'production') {
  // In production, use the deployed backend server URL
  API_BASE_URL = process.env.REACT_APP_API_URL || 'https://airesume-backend-09bv.onrender.com/api';
} else {
  // In development, use the local backend
  API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:10000/api';
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const registerUser = (userData) => {
  return api.post('/auth/register', userData);
};

export const loginUser = (credentials) => {
  return api.post('/auth/login', credentials);
};

export const getUserProfile = () => {
  return api.get('/auth/profile');
};

export const uploadResume = (formData) => {
  return api.post('/resume/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const getJobMatch = (data) => {
  return api.post('/resume/match', data);
};

export const simulateCareerPath = (data) => {
  return api.post('/resume/simulate-career', data);
};

export const predictFutureSkills = (data) => {
  return api.post('/trending/predict-skills', data);
};

export const checkBias = (data) => {
  return api.post('/career/check-bias', data);
};

export const generatePortfolio = (data) => {
  return api.post('/career/generate-portfolio', data);
};

export const predictInterviewQuestions = (data) => {
  return api.post('/career/predict-interview-questions', data);
};

export default api;