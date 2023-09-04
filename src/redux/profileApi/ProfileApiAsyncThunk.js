import {createAsyncThunk} from '@reduxjs/toolkit';
import {api} from '../../api/SecureAPI';

export const getCustomerDetails = createAsyncThunk(
  'customerDetails',
  async (endpoint, thunkAPI) => {
    try {
      const response = await api.get(endpoint);
      return response.data;
    } catch (error) {
      return error;
    }
  },
);
