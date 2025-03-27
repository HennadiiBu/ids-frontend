import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';


axios.defaults.baseURL = import.meta.env.VITE_API_BASEURL;

const setAuthHeader = (token) => {
  axios.defaults.headers.common.Authorization = `Bearer ${token}`;
};

const clearAuthHeader = () => {
  axios.defaults.headers.common.Authorization = '';
};

export const signup = createAsyncThunk(
  'api/auth/signup',
  async (credentials, thunkAPI) => {
    try {
      const res = await axios.post('/api/auth/signup', credentials);
      setAuthHeader(res.data.token);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

export const signIn = createAsyncThunk(
  'api/auth/signin',
  async (credentials, thunkAPI) => {
    try {
      const res = await axios.post('/api/auth/signin', credentials);
      setAuthHeader(res.data.token);
      return res.data;
    } catch (error) {
      if (error.response.status === 401) {
        toast.info('Invalid email or password', {
          position: 'top-center',

        });
      }
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

export const logOut = createAsyncThunk(
  '/api/auth/logout',
  async (_, thunkAPI) => {
    const state = thunkAPI.getState();
    const persistedToken = state.auth.token;

    if (persistedToken === null) {
      return thunkAPI.rejectWithValue('Unable to fetch user');
    }
    try {
      setAuthHeader(persistedToken);
      await axios.post('/api/auth//logout');
      clearAuthHeader();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);