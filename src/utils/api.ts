import axios from 'axios';

const api = import.meta.env.VITE_API_URL;
const customAPI= axios.create({
  baseURL: api,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default customAPI;
