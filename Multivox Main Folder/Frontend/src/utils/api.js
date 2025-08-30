// src/utils/api.js
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('voiceTranslatorUser') 
      ? JSON.parse(localStorage.getItem('voiceTranslatorUser')).token 
      : null;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const translateVideo = async (videoUrl, options) => {
  try {
    const response = await api.post('/translate', {
      video_url: videoUrl,
      ...options,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getTranslationHistory = async () => {
  try {
    const response = await api.get('/history');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getTranslationStatus = async (jobId) => {
  try {
    const response = await api.get(`/status/${jobId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const downloadTranslation = async (jobId, format) => {
  try {
    const response = await api.get(`/download/${jobId}`, {
      params: { format },
      responseType: 'blob',
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getUserProfile = async () => {
  try {
    const response = await api.get('/profile');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updateUserProfile = async (profileData) => {
  try {
    const response = await api.put('/profile', profileData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};