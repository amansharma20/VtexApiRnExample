/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import React, {useCallback, useContext, useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {Box, Text, theme} from '@atoms';
import Icons from '../assets/constants/Icons';
import {api} from '../api/SecureAPI';
import {useDispatch, useSelector} from 'react-redux';
import {CustomerCartIdApiAsyncThunk} from '../redux/customerCartIdApi/CustomerCartIdApiAsyncThunk';
import {getCustomerWishlist} from '../redux/wishlist/GetWishlistApiAsyncThunk';
import {getProductsByWishlistAsyncThunk} from '../redux/wishlist/ProductsWishlistApiAsyncThunk';
import {getCartDataNew} from '../redux/newCartApi/NewCartApiAsyncThunk';
import {Toast} from 'react-native-toast-message/lib/src/Toast';
import {useIsUserLoggedIn} from '../hooks/useIsUserLoggedIn';
import {createCustomerCart} from '../redux/createCustomerCart/CreateCustomerCartApiAsyncThunk';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import CommonLoading from './CommonLoading';
import {guestCartData} from '../redux/GuestCartApi/GuestCartApiAsyncThunk';
import {applicationProperties} from '../utils/application.properties';
import {calculatePrice} from '../utils/CommonFunctions';
import {AuthContext} from '../navigation/StackNavigator';

export default function ProductItem({item, includedData, index}) {
  // console.log('item: ', item);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {isUserLoggedIn} = useIsUserLoggedIn();
  const {signOut} = useContext(AuthContext);

  const [isLoading, setIsLoading] = useState(false);

  const concreteId = item?.attributeMap?.product_concrete_ids?.[0]?.toString();

  const productData = {
    data: {
      type: 'items',
      attributes: {
        sku: concreteId,
        quantity: 1,
        salesUnit: {
          id: 0,
          amount: 0,
        },
        productOptions: [null],
      },
    },
  };

  const productDataForShoppingList = {
    data: {
      type: 'shopping-list-items',
      attributes: {
        productOfferReference: null,
        quantity: 1,
        sku: concreteId,
      },
    },
  };

  const customerCart = useSelector(
    state => state.customerCartIdApiSlice?.customerCart?.data?.data?.[0],
  );

  const customerWishlistFirstId = useSelector(
    state =>
      state?.getWishlistApiSlice?.customerWishlistData?.data?.data?.[0]?.id,
  );

  const productsByWishlist = useSelector(
    state => state?.getProductsByWishlistApiSlice?.productsByWishlist?.data,
  );

  const newCartApiUrl = `https://sushiitobff-dzt0m3.5sc6y6-2.usa-e2.cloudhub.io/carts?cartId=${customerCart?.id}`;

  const onPressAddToCart = async () => {
    setIsLoading(true);
    if (customerCart?.id) {
      const response = await api.post(
        `carts/${customerCart?.id}/items`,
        productData,
      );
      if (response?.data?.status === 201) {
        // dispatch(
        //   getCustomerCartItems(
        //     `carts/${customerCart?.id}?include=items%2Cbundle-items`,
        //   ),
        // ).then(res => {
        //   if (res.payload.status === 200) {
        //     alert('Added to Cart');
        //   }
        //   CommonLoading.hide();
        // });
        dispatch(getCartDataNew(newCartApiUrl)).then(res => {
          if (res.payload.status === 200) {
            console.log('carts api call successful');
            // alert('Added to Cart');
            // CommonLoading.hide();
            Toast.show({
              type: 'success',
              text1: 'Added to cart 🎉',
              position: 'top',
              onPress: () => navigation.navigate('CartScreen'),
            });
            setIsLoading(false);
          } else {
            console.log('mulesoft carts api call not successful');
            // CommonLoading.hide();
            setIsLoading(false);
          }
        });
      } else {
        if (response?.data?.status === 401) {
          signOut();
        }
        alert(response.data.data.errors?.[0]?.detail);
        // CommonLoading.hide();
        setIsLoading(false);
      }
    } else {
      if (customerCart == undefined) {
        const data = applicationProperties.createCartData;
        dispatch(
          createCustomerCart({endpoint: 'carts', data: JSON.stringify(data)}),
        ).then(() => {
          dispatch(CustomerCartIdApiAsyncThunk('carts')).then(() => {
            dispatch(getCartDataNew(newCartApiUrl));
          });
        });
        setIsLoading(false);
      }
    }
  };

  const addToCartAsAGuestUser = async guestCartDataReq => {
    // CommonLoading.show();
    setIsLoading(true);
    const guestCustomerUniqueId = await AsyncStorage.getItem(
      'guestCustomerUniqueId',
    );
    const url = `${applicationProperties.baseUrl}/guest-cart-items`;
    const headers = {
      'Content-Type': 'application/json',
      'X-Anonymous-Customer-Unique-Id': guestCustomerUniqueId,
    };
    await axios
      .post(url, guestCartDataReq, {headers: headers})
      .then(response => {
        // if (response?.status === 201) {
        //   Alert.alert('Added to cart');
        // } else if (response?.status === 404) {
        //   Alert.alert('Cart not found');
        //   return;
        // } else if (response?.status === 422) {
        //   Alert.alert('Product not found');
        //   return;
        // } else {
        //   Alert.alert('Bad Request');
        //   return;
        // }
        dispatch(
          guestCartData({
            endpoint: `${applicationProperties.baseUrl}/guest-carts?include=guest-cart-items%2Cbundle-items%2Cconcrete-products%2Cconcrete-product-image-sets%2Cconcrete-product-availabilities`,
            data: headers,
          }),
        ).then(() => {
          setIsLoading(false);
          Toast.show({
            type: 'success',
            text1: 'Added to cart 🎉',
            position: 'top',
            onPress: () => navigation.navigate('CartScreen'),
          });
        });
        // CommonLoading.hide();
      })
      .catch(error => {
        console.error('Error:', error);
        CommonLoading.hide();
        setIsLoading(false);
      });
  };

  const onPressAddToCartGuestUser = async () => {
    const guestCartDataReq = {
      data: {
        type: 'guest-cart-items',
        attributes: {
          sku: concreteId,
          quantity: 1,
        },
      },
    };
    const guestCustomerUniqueId = await AsyncStorage.getItem(
      'guestCustomerUniqueId',
    );

    if (!guestCustomerUniqueId) {
      const guestUserUniqueId = 'id' + Math.random().toString(16).slice(2);
      AsyncStorage.setItem('guestCustomerUniqueId', guestUserUniqueId);
      addToCartAsAGuestUser(guestCartDataReq);
    } else {
      addToCartAsAGuestUser(guestCartDataReq);
    }
  };

  const goToLogin = () => {
    navigation.navigate('LoginScreen');
  };

  const checkIfAddedInShoppingList = () => {
    const productIds = [];

    productsByWishlist?.included?.forEach(element => {
      if (element.type === 'concrete-products') {
        productIds.push({
          id: element.id,
        });
      }
    });

    return productIds.some(item => item.id === concreteId);
    // console.log('idExists: ', idExists);

    // if (idExists) {
    //   setIsProductExistInShoppingList(true);
    // } else {
    //   setIsProductExistInShoppingList(false);
    // }
  };

  const onPressAddToShoppingList = async () => {
    const response = await api.post(
      `shopping-lists/${customerWishlistFirstId}/shopping-list-items`,
      productDataForShoppingList,
    );
    if (response?.data?.status === 201) {
      dispatch(getCustomerWishlist('shopping-lists'));
      dispatch(
        getProductsByWishlistAsyncThunk(
          `shopping-lists/${customerWishlistFirstId}?include=shopping-list-items%2Cconcrete-products%2Cconcrete-product-image-sets%2Cconcrete-product-prices`,
        ),
      ).then(() => {
        // const wait = new Promise(resolve => setTimeout(resolve, 1000));
        // wait.then(() => {
        // handleClosePress();
        checkIfAddedInShoppingList();
        // });
      });
      alert('Added to shopping list');
    } else {
      Alert.alert('Error', response.data.data.errors?.[0]?.detail, [
        {
          text: 'OK',
          // onPress: () =>
          //   navigation.replace('OrderDetailsScreen', {
          //     checkoutResponse: response?.data?.data?.data,
          //   }),
        },
      ]);
    }
  };

  const renderWishlistButton = useCallback(() => {
    if (checkIfAddedInShoppingList()) {
      // return <Text>true</Text>;
      return (
        <Image
          style={{width: 24, height: 24, resizeMode: 'contain'}}
          source={Icons.addedToWishlistIcon}
        />
      );
    } else {
      // return <Text>false</Text>;
      return (
        <Image
          style={{width: 24, height: 24, resizeMode: 'contain'}}
          source={Icons.wishlistIcon}
        />
      );
    }
  }, [productsByWishlist]);

  useEffect(() => {
    checkIfAddedInShoppingList();
  }, [productsByWishlist]);

  return (
    <Box
      backgroundColor="white"
      flexShrink={1}
      mb="s8"
      borderWidth={1}
      borderColor="border"
      borderRadius={8}
      padding="s12">
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('ProductDetailsScreen', {
            product: item,
          });
        }}>
        <Box alignItems="center">
          <Image
            source={{uri: item?.images[0]?.externalUrlSmall}}
            style={styles.productImage}
            resizeMode="cover"
          />
        </Box>

        {/* <Box position="absolute" alignSelf="flex-end">
          <TouchableOpacity onPress={onPressAddToShoppingList}>
            {renderWishlistButton()}
          </TouchableOpacity>
        </Box> */}
        <Box
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center">
          <Box>
            <Text variant="bold18" numberOfLines={1} marginVertical="s8">
              {item.abstractName}
            </Text>
            <Text variant="bold16">$ {calculatePrice(item.price)}</Text>
          </Box>

          {/* ADD BUTTON */}
          <TouchableOpacity
            onPress={
              isUserLoggedIn ? onPressAddToCart : onPressAddToCartGuestUser
            }
            // onPress={() => {
            //   setSelectedId(!selectedId);
            // }}
          >
            <Box
              backgroundColor="zomatoRed"
              padding="s6"
              paddingHorizontal="s16"
              borderRadius={8}
              flexDirection="row"
              alignItems="center"
              shadowColor="black"
              shadowOpacity={0.1}
              shadowRadius={5}
              elevation={3}>
              <Text
                fontSize={16}
                color="white"
                // fontWeight="700"
                variant="bold18"
                marginRight="s4">
                ADD
              </Text>
              {isLoading === true ? (
                <>
                  <ActivityIndicator
                    style={{width: 24, height: 24}}
                    color={theme.colors.white}
                  />
                </>
              ) : (
                <>
                  <Image
                    source={Icons.addToCartIcon}
                    style={{width: 24, height: 24, tintColor: 'white'}}
                  />
                </>
              )}
            </Box>
          </TouchableOpacity>

          {/* QUANTITY BUTTONS */}
        </Box>
      </TouchableOpacity>
    </Box>
  );
}

const styles = StyleSheet.create({
  productImage: {
    width: 150,
    height: 150,
    marginBottom: 8,
    backgroundColor: 'white',
    resizeMode: 'cover',
  },
  productTitle: {
    fontSize: 16,
    // fontWeight: 'bold',
    // marginBottom: 4,
  },
  productPrice: {
    fontSize: 14,
    color: 'gray',
  },
  button: {
    borderRadius: 14,
  },
});
