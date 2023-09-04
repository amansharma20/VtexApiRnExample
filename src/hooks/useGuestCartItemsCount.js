import {useSelector} from 'react-redux';

export const useGuestCartItemsCount = () => {
  const guestCartData = useSelector(
    state => state.getGuestCartDataApiSlice?.guestCartData,
  );

  function getTotalNormalProductsQuantity(arrayOfObjects) {
    const quantities = arrayOfObjects?.map(obj => obj?.quantity);
    const totalQuantity = quantities?.reduce(
      (accumulator, currentQuantity) => accumulator + currentQuantity,
      0,
    );

    return totalQuantity;
  }
  const guestCartItemsCount =
    getTotalNormalProductsQuantity(guestCartData) || null;

  return {guestCartItemsCount};
};
