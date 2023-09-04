import {createSlice} from '@reduxjs/toolkit';
import {getCustomerCartItems} from './CartApiAsyncThunk';

const initialState = {
  itemsCount: null,
  customerCart: [],
  status: 'idle',
  error: null,
};

function calculateSum(arr, nestedKey) {
  return arr
    .map(obj => obj?.attributes?.[nestedKey])
    .reduce((acc, curr) => acc + curr, 0);
}

const getCustomerCartItemsAliSlice = createSlice({
  name: 'getCustomerCartItems',
  initialState,
  extraReducers: builder => {
    builder.addCase(getCustomerCartItems.pending, (state, action) => {
      state.status = 'loading';
    });
    builder.addCase(getCustomerCartItems.fulfilled, (state, action) => {
      state.status = 'success';
      const cartItem = action?.payload?.data?.included;
      const newCartItems = [];
      cartItem?.map(item => {
        newCartItems.push({
          sku: item.attributes.sku,
          quantity: item.attributes.quantity,
          itemId: item.id,
          itemPrice: item.attributes.calculations.sumGrossPrice,
          configuredBundleItem: item.attributes.configuredBundleItem,
          configuredBundle: item.attributes.configuredBundle,
        });
      });
      state.customerCart = newCartItems;

      const calculateSumFunc = () => {
        if (cartItem !== undefined) {
          state.itemsCount = calculateSum(cartItem, 'quantity');
        } else {
          state.itemsCount = null;
        }
      };
      calculateSumFunc();
    });
    builder.addCase(getCustomerCartItems.rejected, (state, action) => {
      state.status = 'rejected';
    });
  },
});

export default getCustomerCartItemsAliSlice.reducer;
