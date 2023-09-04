/* eslint-disable react-native/no-inline-styles */
import {Box, Text, theme} from '@atoms';
import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  FlatList,
  ActivityIndicator,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GuestCartItem from './GuestCartItems';
import CommonHeader from '../../components/CommonHeader/CommonHeader';
import {guestCartData} from '../../redux/GuestCartApi/GuestCartApiAsyncThunk';
import CommonSolidButton from '../../components/CommonSolidButton/CommonSolidButton';
import {useGuestCartItemsCount} from '../../hooks/useGuestCartItemsCount';
import {useNavigation} from '@react-navigation/native';
import {applicationProperties} from '../../utils/application.properties';
import {calculatePrice} from '../../utils/CommonFunctions';

const GuestCartScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const {guestCartItemsCount} = useGuestCartItemsCount();

  const normalProducts = useSelector(
    state => state.getGuestCartDataApiSlice?.guestCartData,
  );

  const grandTotal = useSelector(
    state =>
      state.getGuestCartDataApiSlice?.itemTotal?.[0]?.attributes?.totals
        ?.grandTotal,
  );
  const discountTotal = useSelector(
    state => state.getGuestCartDataApiSlice?.itemTotal?.[0]?.attributes?.totals,
  );
  console.log('discountTotal: ', discountTotal?.taxTotal);

  const configuredBundles = useSelector(
    state => state.getGuestCartDataApiSlice?.configuredBundle,
  );

  useEffect(() => {
    const guestCart = async () => {
      setIsLoading(true);
      const guestCustomerUniqueId = await AsyncStorage.getItem(
        'guestCustomerUniqueId',
      );
      if (guestCustomerUniqueId) {
        const headers = {
          'X-Anonymous-Customer-Unique-Id': guestCustomerUniqueId,
        };
        dispatch(
          guestCartData({
            endpoint: `${applicationProperties.baseUrl}/guest-carts?include=guest-cart-items%2Cbundle-items%2Cconcrete-products%2Cconcrete-product-image-sets%2Cconcrete-product-availabilities`,
            data: headers,
          }),
        ).then(() => {
          setIsLoading(false);
          console.log('redux called successfully');
        });
        setIsLoading(false);
      } else {
        const guestUserUniqueId = 'id' + Math.random().toString(16).slice(2);
        AsyncStorage.setItem('guestCustomerUniqueId', guestUserUniqueId);
        const headers = {
          'X-Anonymous-Customer-Unique-Id': guestCustomerUniqueId,
        };
        dispatch(
          guestCartData({
            endpoint: `${applicationProperties.baseUrl}/guest-carts?include=guest-cart-items%2Cbundle-items%2Cconcrete-products%2Cconcrete-product-image-sets%2Cconcrete-product-availabilities`,
            data: headers,
          }),
        ).then(() => {
          setIsLoading(false);
          console.log('redux called successfully');
        });
        setIsLoading(false);
      }
    };
    guestCart();
  }, []);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <Box flex={1} backgroundColor="white">
        <CommonHeader title={'Your Cart'} />
        {isLoading ? (
          <>
            <ActivityIndicator />
          </>
        ) : (
          <>
            <ScrollView
              contentContainerStyle={{
                flexGrow: 1,
              }}>
              {grandTotal !== 0 ? (
                <FlatList
                  data={normalProducts}
                  renderItem={item => {
                    const data = item?.item;
                    return <GuestCartItem item={data} />;
                  }}
                  contentContainerStyle={{
                    paddingHorizontal: theme.spacing.paddingHorizontal,
                  }}
                />
              ) : (
                <Box alignItems="center">
                  <Text>No Items in carts</Text>
                </Box>
              )}
              {/* <FlatList
              data={configuredBundles}
              renderItem={item => {
                const data = item?.item;
                return <ConfiguredBundleGuestCart data={data} />;
              }}
            /> */}

              {guestCartItemsCount && grandTotal !== 0 ? (
                <>
                  <Box
                    justifyContent="flex-end"
                    flexDirection="row"
                    paddingVertical="s8">
                    <Text paddingHorizontal="s16">
                      Tax Included : $
                      {discountTotal?.taxTotal !== null ||
                      discountTotal?.taxTotal !== undefined ||
                      discountTotal?.taxTotal
                        ? calculatePrice(discountTotal?.taxTotal)
                        : ''}
                    </Text>
                  </Box>
                  <Box
                    justifyContent="flex-end"
                    flexDirection="row"
                    paddingVertical="s8">
                    <Text paddingHorizontal="s16">
                      Total Discount : $
                      {discountTotal?.discountTotal !== null ||
                      discountTotal?.discountTotal !== undefined ||
                      discountTotal?.discountTotal
                        ? calculatePrice(discountTotal?.discountTotal)
                        : ''}
                    </Text>
                  </Box>
                  <Box
                    justifyContent="flex-end"
                    flexDirection="row"
                    paddingVertical="s8"
                    flex={1}>
                    <Text paddingHorizontal="s16">
                      {normalProducts.length != 0 ? (
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
                <>{/* <ListEmptyComponent /> */}</>
              )}

              {guestCartItemsCount && grandTotal !== 0 ? (
                <Box
                  padding="s16"
                  backgroundColor="white"
                  style={theme.cardVariants.bottomButtonShadow}>
                  <CommonSolidButton
                    title="Proceed to Checkout"
                    // disabled={!allProductAvailableInCarts}
                    onPress={() => {
                      navigation.navigate('LoginScreen', {
                        hideGuestUserCta: true,
                      });
                    }}
                  />
                </Box>
              ) : (
                <></>
              )}
            </ScrollView>
          </>
        )}
      </Box>
    </SafeAreaView>
  );
};
export default GuestCartScreen;
