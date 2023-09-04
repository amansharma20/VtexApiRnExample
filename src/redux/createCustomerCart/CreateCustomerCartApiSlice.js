import {createSlice} from '@reduxjs/toolkit';
import {createCustomerCart} from './CreateCustomerCartApiAsyncThunk';
const initialState = {
  createdCart: {},
  state: 'idle',
  error: null,
};

const createCustomerCartApiSlice = createSlice({
  name: 'customerCart',
  initialState,
  extraReducers: builder => {
    builder.addCase(createCustomerCart.pending, (state, action) => {
      state.status = 'loading';
    });
    builder.addCase(createCustomerCart.fulfilled, (state, action) => {
      state.status = 'success';
      state.createdCart = action.payload;
    });
    builder.addCase(createCustomerCart.rejected, (state, action) => {
      state.status = 'rejected';
    });
  },
});
export default createCustomerCartApiSlice.reducer;
