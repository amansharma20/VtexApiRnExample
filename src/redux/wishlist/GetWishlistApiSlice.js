import {createSlice} from '@reduxjs/toolkit';
import {getCustomerWishlist} from './GetWishlistApiAsyncThunk';

const initialState = {
  customerWishlistData: [],
  status: 'idle',
  error: null,
};

const getWishlistApiSlice = createSlice({
  name: 'getCustomerWishlistData',
  initialState,
  extraReducers: builder => {
    builder.addCase(getCustomerWishlist.pending, (state, action) => {
      state.status = 'loading';
    });
    builder.addCase(getCustomerWishlist.fulfilled, (state, action) => {
      state.status = 'success';
      state.customerWishlistData = action.payload;
    });
    builder.addCase(getCustomerWishlist.rejected, (state, action) => {
      state.status = 'rejected';
    });
  },
});

export default getWishlistApiSlice.reducer;
