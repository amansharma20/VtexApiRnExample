import React, {useEffect, useState} from 'react';
import {api} from '../../api/SecureAPI';
import {Box, Text, theme} from '@atoms';
import {TouchableOpacity, Image, StyleSheet} from 'react-native';
import {getCustomerCartItems} from '../../redux/CartApi/CartApiAsyncThunk';
import {ActivityIndicator} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import * as Keychain from 'react-native-keychain';
import axios from 'axios';
import {CustomerCartIdApiAsyncThunk} from '../../redux/customerCartIdApi/CustomerCartIdApiAsyncThunk';
import {getCartDataNew} from '../../redux/newCartApi/NewCartApiAsyncThunk';

const CartItemQuantity = ({cartItem, removeItemTrigger}) => {
  const quantity = cartItem?.itemData?.attributes?.quantity;
  const itemId = cartItem?.itemData?.id;
  const productSku = cartItem?.itemData?.attributes?.sku;
  const [isloading, setIsLoading] = useState(false);
  const customerCart = useSelector(
    state => state.customerCartIdApiSlice?.customerCart?.data?.data?.[0] || [],
  );
  const dispatch = useDispatch();

  const newCartApiUrl = `https://sushiitobff-dzt0m3.5sc6y6-2.usa-e2.cloudhub.io/carts?cartId=${customerCart.id}`;

  const changeQuantity = async (itemId, count, sku) => {
    setIsLoading(true);

    const productCart = {
      data: {
        type: 'items',
        attributes: {
          sku: sku,
          quantity: count,
          salesUnit: {
            id: 0,
            amount: 0,
          },
          productOptions: [null],
        },
      },
    };
    const resp = await api.patch(
      `carts/${customerCart.id}/items/${itemId}`,
      JSON.stringify(productCart),
    );
    const response = resp.data;
    if (response) {
      // dispatch(
      //   getCustomerCartItems(
      //     `carts/${customerCart.id}?include=items%2Cbundle-items`,
      //   ),
      // ).then(error => {
      //   setIsLoading(false);
      // });
      dispatch(CustomerCartIdApiAsyncThunk('carts')).then(() => {});
      dispatch(getCartDataNew(newCartApiUrl)).then(res => {
        if (res.payload.status === 200) {
          console.log('carts api call successful');
          setIsLoading(false);
        } else {
          setIsLoading(false);
          console.log('mulesoft carts api call not successful');
        }
      });
    } else {
    }
  };

  return (
    <Box flexDirection="row" alignItems="center">
      <TouchableOpacity
        onPress={() =>
          quantity > 1
            ? changeQuantity(itemId, quantity - 1, productSku)
            : removeItemTrigger(itemId)
        }
        style={styles.quantityButton}>
        <Text style={styles.quantityText}>-</Text>
      </TouchableOpacity>
      {isloading ? (
        <Box width={40} alignItems="center">
          <ActivityIndicator color={theme.colors.sushiittoRed} />
        </Box>
      ) : (
        <Box width={40} alignItems="center">
          <Text style={styles.quantity}>{quantity}</Text>
        </Box>
      )}
      <TouchableOpacity
        onPress={() => changeQuantity(itemId, quantity + 1, productSku)}>
        <Text style={styles.quantityText}>+</Text>
      </TouchableOpacity>
    </Box>
  );
};

const styles = StyleSheet.create({
  quantityText: {
    fontSize: 20,
    color: 'black',
  },
  quantity: {
    fontSize: 16,
    marginHorizontal: 8,
  },
});

export default CartItemQuantity;
