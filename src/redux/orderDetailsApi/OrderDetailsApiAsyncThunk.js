import {createAsyncThunk} from '@reduxjs/toolkit';
import {api} from '../../api/SecureAPI';

export const getOrderDetailsData = createAsyncThunk(
  'ordersDetailsData',
  async (endpoint, thunkAPI) => {
    try {
      const response = await api.get(endpoint, thunkAPI);
      return response.data;
    } catch (error) {
      return error;
    }
  },
);
