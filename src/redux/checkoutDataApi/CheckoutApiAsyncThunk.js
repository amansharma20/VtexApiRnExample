import {createAsyncThunk} from '@reduxjs/toolkit';
import {api} from '../../api/SecureAPI';

export const getCheckoutData = createAsyncThunk(
  'checkoutData',
  async ({endpoint, data}, thunkAPI) => {
    try {
      const response = await api.post(endpoint, data);
      return response.data;
    } catch (error) {
      return error;
    }
  },
);
