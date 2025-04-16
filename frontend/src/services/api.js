import axios from 'axios';

const api = axios.create({
  baseURL: 'https://sistema-rifas.onrender.com'
});

export default api;
