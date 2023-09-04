import {createSlice} from '@reduxjs/toolkit';
import {getCartDataNew} from './NewCartApiAsyncThunk';

const initialState = {
  itemsCount: null,
  cartDataNew: [],
  status: 'idle',
  error: null,
};

const getCartDataNewApiSlice = createSlice({
  name: 'getCartDataNew',
  initialState,
  extraReducers: builder => {
    builder.addCase(getCartDataNew.pending, (state, action) => {
      state.status = 'loading';
    });
    builder.addCase(getCartDataNew.fulfilled, (state, action) => {
      state.status = 'success';
      state.cartDataNew = action.payload;
    });
    builder.addCase(getCartDataNew.rejected, (state, action) => {
      state.status = 'rejected';
    });
  },
});

export default getCartDataNewApiSlice.reducer;
