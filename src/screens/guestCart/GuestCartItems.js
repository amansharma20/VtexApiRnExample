import React, {useEffect, useState} from 'react';
import {Box, Text, theme} from '@atoms';
import axios from 'axios';
import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import CartItemQuantity from '../cart/CartItemQuantity';
import {RemoveIcon} from '../../assets/svgs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch, useSelector} from 'react-redux';
import {guestCartData} from '../../redux/GuestCartApi/GuestCartApiAsyncThunk';
import GuestCartItemQuantity from './GuestCartItemQuantity';
import {applicationProperties} from '../../utils/application.properties';
import {calculatePrice} from '../../utils/CommonFunctions';

const GuestCartItem = ({item}) => {
  console.log('item: ', item);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [removeItemIsLoading, setRemoveItemIsLoading] = useState(false);
  const guestCartId = useSelector(
    state => state.getGuestCartDataApiSlice?.itemTotal[0]?.id,
  );

  const removeItem = async itemId => {
    setRemoveItemIsLoading(true);
    const guestCustomerUniqueId = await AsyncStorage.getItem(
      'guestCustomerUniqueId',
    );
    if (guestCustomerUniqueId) {
      const headers = {
        'X-Anonymous-Customer-Unique-Id': guestCustomerUniqueId,
      };
      const url = `${applicationProperties.baseUrl}/guest-carts/${guestCartId}/guest-cart-items/${itemId}`;
      await axios
        .delete(url, {headers: headers})
        .then(response => {
          // if (response?.status === 400) {
          //   Alert.alert('Cart Id or Item Id not specified');
          // } else if (response?.status === 404) {
          //   Alert.alert('Item With the given id not found in the cart');
          // } else if (response?.status === 422) {
          //   Alert.alert('Cart Item could not be deleted');
          // }
          if (response.status == 204) {
            dispatch(
              guestCartData({
                endpoint: `${applicationProperties?.baseUrl}/guest-carts?include=guest-cart-items%2Cbundle-items%2Cconcrete-products%2Cconcrete-product-image-sets%2Cconcrete-product-availabilities`,
                data: headers,
              }),
            ).then(() => {
              setRemoveItemIsLoading(false);
            });
          }
        })
        .catch(error => {
          setRemoveItemIsLoading(false);
          console.error('Error:', error);
        });
    }
  };

  return (
    <Box
      borderRadius={8}
      borderColor="border"
      borderWidth={1}
      mb="s8"
      padding="s8"
      flex={1}>
      {isLoading === true ? (
        <ActivityIndicator />
      ) : removeItemIsLoading ? (
        <ActivityIndicator />
      ) : (
        <Box flexDirection="row">
          <Box alignItems="center" mr="s8">
            <Image
              style={{height: 120, width: 120, resizeMode: 'contain'}}
              source={{
                uri: item?.image,
              }}
            />
            <GuestCartItemQuantity
              cartItem={item}
              removeItemTrigger={removeItem}
            />
          </Box>
          <Box justifyContent="space-between">
            <Box>
              <Box flexDirection="row">
                <Text>{item?.name}</Text>
              </Box>
              <Text variant="bold18" style={{marginTop: 4}}>
                $ {calculatePrice(item?.price)}
              </Text>
              <Text style={{color: '#006400'}}>
                {item?.productOffer != null ? `(Offer Included)` : ''}
              </Text>
              {item?.availability === false ? (
                <Text color="red">Not Available</Text>
              ) : (
                ''
              )}
            </Box>
            <Box mb="s8">
              <TouchableOpacity onPress={() => removeItem(item?.itemId)}>
                <Text>
                  <RemoveIcon />
                </Text>
              </TouchableOpacity>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default GuestCartItem;
