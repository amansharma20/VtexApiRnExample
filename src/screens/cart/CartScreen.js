/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import React, {useState, useEffect, useContext} from 'react';
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import {Box, Text, theme} from '@atoms';
import {useSelector, useDispatch} from 'react-redux';
import CommonHeader from '../../components/CommonHeader/CommonHeader';
import {useNavigation} from '@react-navigation/native';
import {useIsUserLoggedIn} from '../../hooks/useIsUserLoggedIn';
import LoginScreen from '../auth/LoginScreen';
import {CustomerCartIdApiAsyncThunk} from '../../redux/customerCartIdApi/CustomerCartIdApiAsyncThunk';
import CommonSolidButton from '../../components/CommonSolidButton/CommonSolidButton';
import ConfiguredBundledCartItem from './ConfiguredBundledCartItem';
import {createCustomerCart} from '../../redux/createCustomerCart/CreateCustomerCartApiAsyncThunk';
import {AuthContext} from '../../navigation/StackNavigator';
import CartItem from './CartItem';
import {getCartDataNew} from '../../redux/newCartApi/NewCartApiAsyncThunk';
import {useCartItemsCount} from '../../hooks/useCartItemsCount';
import GuestCartScreen from '../guestCart/GuestCartScreen';
import {applicationProperties} from '../../utils/application.properties';
import {calculatePrice} from '../../utils/CommonFunctions';
const CartScreen = () => {
  const {signOut} = useContext(AuthContext);
  const {cartItemsCount} = useCartItemsCount();
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(true);
  const [cartItemsArray, setCartItemsArray] = useState([]);
  const {isUserLoggedIn} = useIsUserLoggedIn();

  const [allProductAvailableInCarts, setAllProductsAvailableInCarts] =
    useState(true);

  const dispatch = useDispatch();

  const customerCarts = useSelector(
    state => state.customerCartIdApiSlice?.customerCart?.data?.data || [],
  );

  const customerCartId = useSelector(
    state =>
      state.customerCartIdApiSlice?.customerCart?.data?.data?.[0]?.id || '',
  );
  console.log('customerCartId: ', customerCartId);

  const customerCartData = useSelector(
    state => state.getCustomerCartItemsAliSlice?.customerCart || [],
  );

  const customerCart = useSelector(
    state => state.customerCartIdApiSlice?.customerCart?.data?.data?.[0] || [],
  );

  const customerCartDataNew = useSelector(
    state => state.getCartDataNewApiSlice?.cartDataNew.data,
  );

  const grandTotal = customerCartDataNew?.attributes?.totals?.grandTotal;
  const taxTotal = customerCartDataNew?.attributes?.totals?.taxTotal;

  const discountTotal = customerCartDataNew?.attributes?.totals?.discountTotal;

  const newCartApiUrl = `https://sushiitobff-dzt0m3.5sc6y6-2.usa-e2.cloudhub.io/carts?cartId=${customerCartId}`;

  useEffect(() => {
    if (customerCartId) {
      dispatch(getCartDataNew(newCartApiUrl)).then(res => {
        if (res.payload.status === 200) {
          console.log('carts api call successful');
          setIsLoading(false);
        } else {
          setIsLoading(false);
          console.log('mulesoft carts api call not successful');
        }
      });
    }
  }, [customerCartId]);

  useEffect(() => {
    if (customerCartDataNew?.length !== 0 && customerCartId) {
      let tempArr = [];

      customerCartDataNew?.normalProduct?.map(item => {
        tempArr.push(item.itemData.id);
      });

      customerCartDataNew?.configureBundle?.map(item => {
        item.attributes.map(subItem => {
          tempArr.push(subItem.itemData.attributes.groupKey);
        });
      });

      setCartItemsArray(tempArr);
    }
  }, [customerCartDataNew]);

  // useEffect(() => {
  //   if (customerCartDataNew?.length !== 0) {
  //     for (const item of customerCartDataNew?.normalProduct) {
  //       const availability =
  //         item?.['concrete-product-availabilities']?.availability;
  //       if (!availability) {
  //         setAllProductsAvailableInCarts(false);
  //         break;
  //       }
  //     }
  //   }
  // }, [customerCartDataNew]);

  useEffect(() => {
    if (customerCarts.length === 0) {
      const data = applicationProperties.createCartData;
      dispatch(
        createCustomerCart({endpoint: 'carts', data: JSON.stringify(data)}),
      ).then(response => {
        if (response.payload.status === 401) {
          signOut();
        }
      });
      dispatch(CustomerCartIdApiAsyncThunk('carts')).then(response => {
        if (response.payload.status === 401) {
          signOut();
        } else {
          console.log('carts api call successful');
        }
      });
    }
  }, []);

  const ListEmptyComponent = () => {
    return (
      <Box flex={1} justifyContent="center">
        <Text textAlign="center">No Items in cart.</Text>
      </Box>
    );
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <Box flex={1} backgroundColor="white">
        {isUserLoggedIn ? (
          <>
            <CommonHeader title={'Your Cart'} />
            {isLoading ? (
              <>
                <ActivityIndicator color={theme.colors.sushiittoRed} />
              </>
            ) : (
              <>
                <ScrollView
                  contentContainerStyle={{
                    flexGrow: 1,
                    paddingHorizontal: theme.spacing.paddingHorizontal,
                  }}>
                  <Box>
                    <FlatList
                      data={customerCartDataNew?.configureBundle}
                      renderItem={item => {
                        const data = item?.item;
                        return (
                          <ConfiguredBundledCartItem
                            data={data}
                            customerCartId={customerCartId}
                          />
                        );
                      }}
                      scrollEnabled={false}
                    />
                    <FlatList
                      data={customerCartDataNew?.normalProduct}
                      renderItem={item => {
                        const data = item?.item;
                        return <CartItem item={data} />;
                      }}
                      // ListEmptyComponent={
                      //   isLoading === false ? (
                      //     <ListEmptyComponent />
                      //   ) : (
                      //     <ActivityIndicator />
                      //   )
                      // }
                      scrollEnabled={false}
                    />
                    {cartItemsCount ? (
                      <>
                        <Box
                          justifyContent="flex-end"
                          flexDirection="row"
                          paddingVertical="s8">
                          <Text>
                            Total Discount : $
                            {discountTotal !== null ||
                            discountTotal !== undefined ||
                            discountTotal
                              ? calculatePrice(discountTotal)
                              : ''}
                          </Text>
                        </Box>
                        <Box justifyContent="flex-end" flexDirection="row">
                          <Text>
                            Tax Included : $
                            {taxTotal !== null ||
                            taxTotal !== undefined ||
                            taxTotal
                              ? calculatePrice(taxTotal)
                              : ''}
                          </Text>
                        </Box>
                        <Box
                          justifyContent="flex-end"
                          flexDirection="row"
                          paddingVertical="s8">
                          <Text>
                            {customerCartDataNew.length != 0 ? (
                              <Text variant="bold24">
                                Total : $ {calculatePrice(grandTotal)}
                              </Text>
                            ) : (
                              ''
                            )}
                          </Text>
                        </Box>
                      </>
                    ) : (
                      <>
                        <ListEmptyComponent />
                      </>
                    )}
                  </Box>
                </ScrollView>
                {cartItemsCount ? (
                  <Box
                    padding="s16"
                    style={theme.cardVariants.bottomButtonShadow}
                    backgroundColor="white">
                    <CommonSolidButton
                      title="Proceed to Checkout"
                      disabled={!allProductAvailableInCarts}
                      onPress={() =>
                        navigation.replace('CheckoutScreen', {
                          cartId: customerCartId,
                          cartItemsArray: cartItemsArray,
                        })
                      }
                    />
                  </Box>
                ) : (
                  <></>
                )}
              </>
            )}
          </>
        ) : (
          <>
            {/* <LoginScreen /> */}
            <GuestCartScreen />
          </>
        )}
      </Box>
    </SafeAreaView>
  );
};
export default CartScreen;
