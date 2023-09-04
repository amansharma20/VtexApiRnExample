import {createSlice} from '@reduxjs/toolkit';
import {getCustomerDetails} from './ProfileApiAsyncThunk';

const initialState = {
  customerDetails: {},
  status: 'idle',
  error: null,
};

const getCustomerDetailsApiSlice = createSlice({
  name: 'getCustomerDetails',
  initialState,
  extraReducers: builder => {
    builder.addCase(getCustomerDetails.pending, (state, action) => {
      state.status = 'loading';
    });
    builder.addCase(getCustomerDetails.fulfilled, (state, action) => {
      state.status = 'success';
      state.customerDetails = action.payload;
    });
    builder.addCase(getCustomerDetails.rejected, (state, action) => {
      state.status = 'rejected';
    });
  },
});

export default getCustomerDetailsApiSlice.reducer;
