import {createSlice} from '@reduxjs/toolkit';
import {getProductsByWishlistAsyncThunk} from './ProductsWishlistApiAsyncThunk';
const initialState = {
  productsByWishlist: [],
  status: 'idle',
  error: null,
};

const getProductsByWishlistApiSlice = createSlice({
  name: 'getProductsByWishlist',
  initialState,
  extraReducers: builder => {
    builder.addCase(
      getProductsByWishlistAsyncThunk.pending,
      (state, action) => {
        state.status = 'loading';
      },
    );
    builder.addCase(
      getProductsByWishlistAsyncThunk.fulfilled,
      (state, action) => {
        state.status = 'success';
        state.productsByWishlist = action.payload;
      },
    );
    builder.addCase(
      getProductsByWishlistAsyncThunk.rejected,
      (state, action) => {
        state.status = 'rejected';
      },
    );
  },
});

export default getProductsByWishlistApiSlice.reducer;
