import {useSelector} from 'react-redux';
import {useIsUserLoggedIn} from './useIsUserLoggedIn';

export const useCartItemsCount = () => {
  const {isUserLoggedIn} = useIsUserLoggedIn();
  const customerCartDataNew = useSelector(
    state => state.getCartDataNewApiSlice?.cartDataNew.data,
  );

  const guestCartData = useSelector(
    state => state.getGuestCartDataApiSlice?.guestCartData,
  );

  function getTotalNormalProductsQuantity(arrayOfObjects) {
    const quantities = arrayOfObjects?.map(
      obj => obj?.itemData?.attributes?.quantity,
    );
    const totalQuantity = quantities?.reduce(
      (accumulator, currentQuantity) => accumulator + currentQuantity,
      0,
    );

    return totalQuantity;
  }

  function getTotalConfiguredProductsQuantity(arrayOfObjects) {
    const quantities = arrayOfObjects?.map(obj => obj?.groupquantity);
    const totalQuantity = quantities?.reduce(
      (accumulator, currentQuantity) => accumulator + currentQuantity,
      0,
    );
    return totalQuantity;
  }

  function getTotalGuestProductsQuantity(arrayOfObjects) {
    const quantities = arrayOfObjects?.map(obj => obj?.quantity);
    const totalQuantity = quantities?.reduce(
      (accumulator, currentQuantity) => accumulator + currentQuantity,
      0,
    );

    return totalQuantity;
  }

  const guestCartItemsCount =
    getTotalGuestProductsQuantity(guestCartData) || null;
  console.log('guestCartItemsCount: ', guestCartItemsCount);

  const cartItemsCount = isUserLoggedIn
    ? getTotalNormalProductsQuantity(customerCartDataNew?.normalProduct) +
        getTotalConfiguredProductsQuantity(
          customerCartDataNew?.configureBundle,
        ) || null
    : guestCartItemsCount || null;
  console.log('cartItemsCount: ', cartItemsCount);

  return {cartItemsCount};
};
