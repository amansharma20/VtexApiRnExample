import React, {useState} from 'react';
import {Box, Text, theme} from '@atoms';
import {
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {api} from '../../api/SecureAPI';
import {useDispatch, useSelector} from 'react-redux';
import {getProductsByWishlistAsyncThunk} from '../../redux/wishlist/ProductsWishlistApiAsyncThunk';
import {getCustomerWishlist} from '../../redux/wishlist/GetWishlistApiAsyncThunk';

const WishListItemQuantityScreen = ({
  shoppingListId,
  shoppingListItemId,
  productSku,
  quantity,
}) => {
  const [isloading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const changeQuantity = async (
    shoppingListId,
    shoppingListItemId,
    productSku,
    quantity,
  ) => {
    setIsLoading(true);

    const productData = {
      data: {
        type: 'shopping-list-items',
        attributes: {
          sku: productSku,
          quantity: quantity,
        },
      },
    };
    const resp = await api.patch(
      `shopping-lists/${shoppingListId}/shopping-list-items/${shoppingListItemId}`,
      JSON.stringify(productData),
    );
    const response = resp.data;
    if (response) {
      dispatch(
        getProductsByWishlistAsyncThunk(
          `shopping-lists/${shoppingListId}?include=shopping-list-items%2Cconcrete-products%2Cconcrete-product-image-sets%2Cconcrete-product-prices`,
        ),
      );
      dispatch(getCustomerWishlist('shopping-lists')).then(() => {
        setIsLoading(false);
      });
    } else {
    }
  };
  return (
    <Box flexDirection="row" alignItems="center">
      <TouchableOpacity
        onPress={() =>
          changeQuantity(
            shoppingListId,
            shoppingListItemId,
            productSku,
            quantity - 1,
          )
        }>
        <Text style={styles.quantityText}>-</Text>
      </TouchableOpacity>
      {isloading ? (
        <ActivityIndicator color={theme.colors.sushiittoRed} />
      ) : (
        <Text style={styles.quantity}>
          {isloading ? (
            <ActivityIndicator color={theme.colors.sushiittoRed} />
          ) : (
            quantity
          )}
        </Text>
      )}
      <TouchableOpacity
        onPress={() =>
          changeQuantity(
            shoppingListId,
            shoppingListItemId,
            productSku,
            quantity + 1,
          )
        }>
        <Text style={styles.quantityText}>+</Text>
      </TouchableOpacity>
    </Box>
  );
};

const styles = StyleSheet.create({
  quantityText: {
    fontSize: 24,
    color: 'black',
  },
  quantity: {
    fontSize: 20,
    marginHorizontal: 10,
  },
});
export default WishListItemQuantityScreen;
