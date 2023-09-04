import {createSlice} from '@reduxjs/toolkit';
import {guestCartData} from './GuestCartApiAsyncThunk';

const initialState = {
  itemsCount: null,
  guestCartData: [],
  configuredBundle: [],
  itemTotal: {},
  status: 'idle',
  error: null,
};

const getGuestCartDataApiSlice = createSlice({
  name: 'getGuestCartData',
  initialState,
  extraReducers: builder => {
    builder.addCase(guestCartData.pending, (state, action) => {
      state.status = 'loading';
    });
    builder.addCase(guestCartData.fulfilled, (state, action) => {
      state.status = 'success';
      state.itemTotal = action.payload.data;
      const total = action.payload.data?.[0]?.attributes?.totals.grandTotal;
      const customerCartData = action?.payload?.included;
      if (total !== 0) {
        if (action?.payload?.included?.length > 0) {
          const concreteProductData = [];
          const image = [];
          const quantity = [];
          const price = [];
          action?.payload?.included.forEach(element => {
            console.log('element: ', element);
            switch (element.type) {
              case 'concrete-products':
                concreteProductData.push({
                  id: element.id,
                  name: element.attributes.name,
                });
                break;
              case 'concrete-product-image-sets':
                image.push({
                  id: element.id,
                  image:
                    element?.attributes?.imageSets[0]?.images[0]
                      ?.externalUrlLarge,
                });
                break;
              case 'guest-cart-items':
                quantity.push({
                  quantity: element.attributes.quantity,
                  id: element.attributes.sku,
                  groupKey: element.attributes.groupKey,
                  itemId: element.id,
                  price:
                    element.attributes.calculations.sumGrossPrice != 0
                      ? element.attributes.calculations.sumGrossPrice
                      : element.attributes.calculations.sumNetPrice,
                  productOffer: element.attributes.merchantReference,
                  // configuredBundle: element.attributes.configuredBundle,
                  // configuredBundleItem: element.attributes.configuredBundleItem,
                });
                break;
            }
          });

          const guestCartItems = () =>
            quantity.map(concreteProduct => {
              const matchingImage = image.find(
                img => img.id === concreteProduct.id,
              );
              const matchingQuantity = quantity.find(
                qty => qty.id === concreteProduct.id,
              );
              const name = concreteProductData.find(
                item => item.id === concreteProduct.id,
              );
              return {
                id: concreteProduct.id,
                name: name.name,
                image: matchingImage?.image,
                quantity: matchingQuantity?.quantity || 0,
                price: matchingQuantity?.price || 0,
                itemId: matchingQuantity.itemId,
                groupKey: matchingQuantity.groupKey,
                productOffer: matchingQuantity.productOffer,
              };
            });
          state.guestCartData = guestCartItems();

          // configured bundle for guest cart
          const getConfiguredBundle = () => {
            const uuidsSet = new Set();

            action?.payload?.included?.forEach(items => {
              if (items?.attributes?.configuredBundle != null) {
                const uuid = items?.attributes?.configuredBundle?.groupKey;
                if (uuid) {
                  uuidsSet.add(uuid);
                }
              }
            });
            const uuids = Array.from(uuidsSet).map(uuid => ({uuid: uuid}));

            const newDataArray = uuids.map(uuidObj => {
              const templateName = customerCartData.find(
                item =>
                  item.attributes.configuredBundle?.groupKey === uuidObj.uuid,
              )?.attributes?.configuredBundle?.template?.name;

              const templateUUID = customerCartData.find(
                item =>
                  item.attributes.configuredBundle?.groupKey === uuidObj.uuid,
              )?.attributes?.configuredBundle?.template?.uuid;
              const slotUUID = customerCartData.find(
                item =>
                  item.attributes.configuredBundle?.groupKey === uuidObj.uuid,
              )?.attributes?.configuredBundleItem?.slot?.uuid;
              const quantity = customerCartData.find(
                item =>
                  item.attributes.configuredBundle?.groupKey === uuidObj.uuid,
              )?.attributes?.configuredBundle?.quantity;
              const data = customerCartData.filter(
                item =>
                  item.attributes.configuredBundle?.groupKey === uuidObj.uuid,
              );
              const groupKey = customerCartData.find(
                item =>
                  item.attributes.configuredBundle?.groupKey === uuidObj.uuid,
              )?.attributes?.configuredBundle?.groupKey;
              return {
                templateName,
                quantity,
                templateUUID,
                slotUUID,
                data,
                groupKey,
              };
            });
            return newDataArray;
          };
          state.configuredBundle = getConfiguredBundle();
        }
      } else {
        state.guestCartData = [];
      }
    });
    builder.addCase(guestCartData.rejected, (state, action) => {
      state.status = 'rejected';
    });
  },
});

export default getGuestCartDataApiSlice.reducer;
