import axios from 'axios';

const API_BASE = "https://millapi.vercel.app/api";

const axiosClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosClient;
