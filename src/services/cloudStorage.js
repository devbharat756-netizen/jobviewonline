import axios from 'axios';

// Auto-read from LocalStorage (set via Admin Settings)
const API_KEY = localStorage.getItem('cloudApiKey') || '$2a$10$NESVUHeZJxLKaERiMNyVZON7hzy9fT5RWOD448bvNyV1zaJHbCsuK';
const BIN_ID = localStorage.getItem('cloudBinId') || '6a6732eada38895dfe95ac20';
const BASE_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

const getHeaders = () => ({
  'Content-Type': 'application/json',
  'X-Master-Key': localStorage.getItem('cloudApiKey') || API_KEY,
});

export async function saveToCloud(data) {
  const res = await axios.put(BASE_URL, data, { headers: getHeaders() });
  return res.data;
}

export async function loadFromCloud() {
  const res = await axios.get(`${BASE_URL}/latest`, { headers: getHeaders() });
  return res.data.record;
}

export function isConfigured() {
  const key = localStorage.getItem('cloudApiKey');
  const bin = localStorage.getItem('cloudBinId');
  return !!key && !!bin && key !== 'PASTE_YOUR_API_KEY_HERE' && bin !== 'PASTE_YOUR_BIN_ID_HERE';
}