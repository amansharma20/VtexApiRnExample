import {createSlice} from '@reduxjs/toolkit';
import {getOrderDetailsData} from './OrderDetailsApiAsyncThunk';

const initialState = {
  orderDetailsData: {},
  status: 'idle',
  error: null,
};

const getOrderDetailsDataApiSlice = createSlice({
  name: 'getOrderDetailsData',
  initialState,
  extraReducers: builder => {
    builder.addCase(getOrderDetailsData.pending, (state, action) => {
      state.status = 'loading';
    });
    builder.addCase(getOrderDetailsData.fulfilled, (state, action) => {
      state.status = 'success';
      state.orderDetailsData = action.payload;
    });
    builder.addCase(getOrderDetailsData.rejected, (state, action) => {
      state.status = 'rejected';
    });
  },
});

export default getOrderDetailsDataApiSlice.reducer;
