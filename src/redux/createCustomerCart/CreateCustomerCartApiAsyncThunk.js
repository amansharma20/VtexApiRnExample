import {createAsyncThunk} from '@reduxjs/toolkit';
import {api} from '../../api/SecureAPI';

export const createCustomerCart = createAsyncThunk(
  'createCart',
  async ({endpoint, data}, thunkAPI) => {
    try {
      const response = await api.post(endpoint, data);
      return response.data;
    } catch (error) {
      return error;
    }
  },
);
