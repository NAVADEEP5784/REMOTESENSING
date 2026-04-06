import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '';

const AUTH_KEY = 'authToken';

export function getToken() {
  return localStorage.getItem(AUTH_KEY) || localStorage.getItem('adminToken');
}

const getAuthHeaders = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export async function analyzeImage(file) {
  const formData = new FormData();
  formData.append('image', file);

  const { data } = await axios.post(`${API_URL}/api/analyze`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

export async function chat(message, classification, detections) {
  const { data } = await axios.post(`${API_URL}/api/chat`, {
    message,
    classification,
    detections,
  });
  return data;
}

export async function register(email, password, name) {
  const { data } = await axios.post(`${API_URL}/api/auth/register`, {
    email,
    password,
    name,
  });
  return data;
}

export async function login(email, password) {
  const { data } = await axios.post(`${API_URL}/api/auth/login`, {
    email,
    password,
  });
  return data;
}

export async function verifyToken() {
  try {
    const { data } = await axios.post(
      `${API_URL}/api/auth/verify`,
      {},
      { headers: getAuthHeaders() }
    );
    return data;
  } catch {
    return { valid: false };
  }
}

export async function getProfile() {
  const { data } = await axios.post(
    `${API_URL}/api/auth/verify`,
    {},
    { headers: getAuthHeaders() }
  );
  return data;
}

export async function getAdminStats() {
  const { data } = await axios.get(`${API_URL}/api/admin/stats`, {
    headers: getAuthHeaders(),
  });
  return data;
}

export async function getAdminUploads() {
  const { data } = await axios.get(`${API_URL}/api/admin/uploads`, {
    headers: getAuthHeaders(),
  });
  return data;
}
