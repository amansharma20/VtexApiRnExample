import {createAsyncThunk} from '@reduxjs/toolkit';
import {api} from '../../api/SecureAPI';

export const getCartDataNew = createAsyncThunk(
  'cartDataNew',
  async (endpoint, data) => {
    try {
      const response = await api.getWithUrl(endpoint, data);
      return response.data;
    } catch (error) {
      return error;
    }
  },
);
