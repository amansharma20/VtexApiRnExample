import {createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
export const guestCartData = createAsyncThunk(
  'guestCartData',
  async ({endpoint, data}) => {
    try {
      const response = await axios.get(endpoint, {headers: data});
      return response.data;
    } catch (error) {
      throw error;
    }
  },
);
