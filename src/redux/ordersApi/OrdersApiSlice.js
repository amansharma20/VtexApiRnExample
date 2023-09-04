import {createSlice} from '@reduxjs/toolkit';
import {getOrdersData} from './OrdersApiAsyncThunk';

const initialState = {
  ordersData: {},
  status: 'idle',
  error: null,
};

const getOrdersDataApiSlice = createSlice({
  name: 'getOrdersData',
  initialState,
  extraReducers: builder => {
    builder.addCase(getOrdersData.pending, (state, action) => {
      state.status = 'loading';
    });
    builder.addCase(getOrdersData.fulfilled, (state, action) => {
      state.status = 'success';
      state.ordersData = action.payload;
    });
    builder.addCase(getOrdersData.rejected, (state, action) => {
      state.status = 'rejected';
    });
  },
});

export default getOrdersDataApiSlice.reducer;
