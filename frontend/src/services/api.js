import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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