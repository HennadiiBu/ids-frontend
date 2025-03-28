import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';

axios.defaults.baseURL = import.meta.env.VITE_API_BASEURL;

export const fetchData = createAsyncThunk('data/fetchData', async (filters) => {
  const response = await axios.get('/api/data', { params: filters });
// Логируем данные от API
  return response.data;
});