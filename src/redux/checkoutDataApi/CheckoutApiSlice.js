import {createSlice} from '@reduxjs/toolkit';
import {getCheckoutData} from './CheckoutApiAsyncThunk';

const initialState = {
  checkoutData: {},
  status: 'idle',
  error: null,
};

const getCheckoutDataApiSlice = createSlice({
  name: 'getCheckoutData',
  initialState,
  extraReducers: builder => {
    builder.addCase(getCheckoutData.pending, (state, action) => {
      state.status = 'loading';
    });
    builder.addCase(getCheckoutData.fulfilled, (state, action) => {
      state.status = 'success';
      state.checkoutData = action.payload;
    });
    builder.addCase(getCheckoutData.rejected, (state, action) => {
      state.status = 'rejected';
    });
  },
});

export default getCheckoutDataApiSlice.reducer;
