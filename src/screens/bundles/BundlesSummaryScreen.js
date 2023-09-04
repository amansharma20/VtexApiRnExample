/* eslint-disable react-native/no-inline-styles */
import {Alert, SafeAreaView, StyleSheet} from 'react-native';
import React, {useEffect} from 'react';
import {Box, Text, theme} from '@atoms';
import CommonHeader from '../../components/CommonHeader/CommonHeader';
import {FlashList} from '@shopify/flash-list';
import FastImage from 'react-native-fast-image';
import CommonSolidButton from '../../components/CommonSolidButton/CommonSolidButton';
import {api} from '../../api/SecureAPI';
import CommonLoading from '../../components/CommonLoading';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {CustomerCartIdApiAsyncThunk} from '../../redux/customerCartIdApi/CustomerCartIdApiAsyncThunk';
import {useDispatch} from 'react-redux';
import {useIsUserLoggedIn} from '../../hooks/useIsUserLoggedIn';
import {calculatePrice} from '../../utils/CommonFunctions';
const BundlesSummaryScreen = props => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {isUserLoggedIn} = useIsUserLoggedIn();
  const summaryBundleData = props.route?.params?.summaryBundleData;
  const configurableBundleId = props.route?.params?.configurableBundleId;
  const postProductSlotsData = props.route?.params?.postProductSlotsData;
  console.log(
    'postProductSlotsData: ',
    postProductSlotsData?.data?.attributes?.items,
  );

  const customerCartId = useSelector(
    state =>
      state.customerCartIdApiSlice?.customerCart?.data?.data?.[0]?.id || '',
  );

  useEffect(() => {
    dispatch(CustomerCartIdApiAsyncThunk('carts')).then(() => {
      console.log('carts api call successful');
    });
  }, [props]);

  const addToCart = async () => {
    CommonLoading.show();
    const response = await api.post(
      `carts/${customerCartId}/configured-bundles`,
      postProductSlotsData,
    );

    if (response?.data?.status === 201) {
      console.log('response?.data: success ', response?.data);
      navigation.navigate('CartScreen');
      CommonLoading.hide();
    } else {
      Alert.alert(response?.data?.data?.errors?.[0]?.detail);
      CommonLoading.hide();
    }
  };

  const addtoCartAsGuestUser = () => {
    // CommonLoading.show();
    console.log('comming');
  };

  const renderItem = (item, index) => {
    return (
      <Box>
        <Box
          flex={1}
          flexDirection="row"
          marginHorizontal="s4"
          flexShrink={1}
          mb="s8"
          borderWidth={1}
          borderColor="border"
          borderRadius={8}
          padding="s8"
          key={item.id}>
          <Box alignItems="center">
            <FastImage
              source={{uri: item?.item?.item?.image}}
              style={styles.productImage}
            />
          </Box>
          <Box paddingLeft="s4" justifyContent="space-between">
            <Box flexShrink={1} maxWidth={'100%'}>
              <Text
                style={styles.productTitle}
                variant="bold18"
                numberOfLines={2}>
                {item?.item?.item?.name}
              </Text>
              <Text style={styles.productPrice}>
                $ {calculatePrice(item?.item?.item?.price)}
              </Text>
            </Box>
          </Box>
        </Box>
      </Box>
    );
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <Box flex={1} backgroundColor="white">
        <CommonHeader title={'Bundles Summary'} />
        <Box flex={1}>
          <FlashList
            data={summaryBundleData}
            renderItem={renderItem}
            estimatedItemSize={4}
            contentContainerStyle={{
              paddingHorizontal: theme.spacing.s16,
            }}
          />
          {isUserLoggedIn ? (
            <Box
              padding="s16"
              backgroundColor="white"
              style={theme.cardVariants.bottomButtonShadow}>
              <CommonSolidButton
                title={'Add to cart'}
                onPress={() => {
                  addToCart();
                }}
              />
            </Box>
          ) : (
            <Box
              padding="s16"
              backgroundColor="white"
              style={theme.cardVariants.bottomButtonShadow}>
              <CommonSolidButton
                title={'Add to Guest cart'}
                onPress={() => {
                  addtoCartAsGuestUser();
                }}
              />
            </Box>
          )}
        </Box>
      </Box>
    </SafeAreaView>
  );
};

export default BundlesSummaryScreen;

const styles = StyleSheet.create({
  productImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  productTitle: {
    fontSize: 16,
    // fontWeight: 'bold',
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 14,
  },
});
