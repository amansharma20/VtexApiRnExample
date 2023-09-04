import {createSlice} from '@reduxjs/toolkit';
import {CustomerCartIdApiAsyncThunk} from './CustomerCartIdApiAsyncThunk';
const initialState = {
  customerCart: [],
  status: 'idle',
  error: null,
};

const customerCartIdApiSlice = createSlice({
  name: 'CustomerCartIdApiAsyncThunk',
  initialState,
  extraReducers: builder => {
    builder.addCase(CustomerCartIdApiAsyncThunk.pending, (state, action) => {
      state.status = 'loading';
    });
    builder.addCase(CustomerCartIdApiAsyncThunk.fulfilled, (state, action) => {
      state.status = 'success';
      state.customerCart = action.payload;
    });
    builder.addCase(CustomerCartIdApiAsyncThunk.rejected, (state, action) => {
      state.status = 'rejected';
    });
  },
});

export default customerCartIdApiSlice.reducer;
