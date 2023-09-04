import React, {useEffect, useState} from 'react';
import {Box, Text} from '@atoms';
import {TouchableOpacity, Image, StyleSheet, Alert} from 'react-native';
import {ActivityIndicator} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {guestCartData} from '../../redux/GuestCartApi/GuestCartApiAsyncThunk';
import {applicationProperties} from '../../utils/application.properties';

const GuestCartItemQuantity = ({cartItem, removeItemTrigger}) => {
  const [isloading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const guestCartId = useSelector(
    state => state.getGuestCartDataApiSlice?.itemTotal[0]?.id,
  );
  const changeQuantity = async (groupKey, count, sku) => {
    setIsLoading(true);
    const url = `${applicationProperties.baseUrl}/guest-carts/${guestCartId}/guest-cart-items/${groupKey}`;
    const guestCustomerUniqueId = await AsyncStorage.getItem(
      'guestCustomerUniqueId',
    );
    const headers = {
      'Content-Type': 'application/json',
      'X-Anonymous-Customer-Unique-Id': guestCustomerUniqueId,
    };
    const guestProductCart = {
      data: {
        type: 'guest-cart-items',
        attributes: {
          sku: sku,
          quantity: count,
        },
      },
    };
    await axios
      .patch(url, guestProductCart, {headers: headers})
      .then(response => {
        if (response?.status == 200) {
          dispatch(
            guestCartData({
              endpoint: `${applicationProperties.baseUrl}/guest-carts?include=guest-cart-items%2Cbundle-items%2Cconcrete-products%2Cconcrete-product-image-sets%2Cconcrete-product-availabilities`,
              data: headers,
            }),
          ).then(res => {
            setIsLoading(false);
            console.log('res: ', res);
          });
        }
      })
      .catch(error => {
        Alert.alert('Product not found');
        setIsLoading(false);
      });
  };

  return (
    <Box flexDirection="row" alignItems="center">
      <TouchableOpacity
        onPress={() =>
          cartItem?.quantity > 1
            ? changeQuantity(
                cartItem?.itemId,
                cartItem?.quantity - 1,
                cartItem?.id,
              )
            : removeItemTrigger(cartItem?.itemId)
        }
        style={styles.quantityButton}>
        <Text style={styles.quantityText}>-</Text>
      </TouchableOpacity>
      {isloading ? (
        <ActivityIndicator />
      ) : (
        <Text style={styles.quantity}>{cartItem?.quantity}</Text>
      )}
      <TouchableOpacity
        onPress={() =>
          changeQuantity(cartItem?.itemId, cartItem?.quantity + 1, cartItem?.id)
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

export default GuestCartItemQuantity;
