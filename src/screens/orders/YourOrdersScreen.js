import React, {useEffect, useState} from 'react';
import {Box, Text, theme} from '@atoms';
import CommonHeader from '../../components/CommonHeader/CommonHeader';
import {useDispatch, useSelector} from 'react-redux';
import {getOrdersData} from '../../redux/ordersApi/OrdersApiAsyncThunk';
import {ActivityIndicator, FlatList, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {getCustomerDetails} from '../../redux/profileApi/ProfileApiAsyncThunk';
import {calculatePrice} from '../../utils/CommonFunctions';

const YourOrdersScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);

  const ordersData = useSelector(
    state => state.getOrdersDataApiSlice.ordersData?.data?.data || [],
  );

  const profileId = useSelector(
    state =>
      state.getCustomerDetailsApiSlice.customerDetails?.data?.data?.[0]?.id ||
      '',
  );

  const renderItem = ({item}) => {
    const isDelivered = item.attributes?.itemStates?.includes('paid');
    const orderDate = new Date(item.attributes?.createdAt).toLocaleDateString();

    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('OrderDetailsScreen', {
            orderId: item.id,
          })
        }>
        <Box
          bg="white"
          padding="s4"
          borderRadius={8}
          borderWidth={1}
          mb="s4"
          borderColor="border">
          <Box flexDirection="row" justifyContent="space-between" mb="s2">
            <Text
              fontSize={16}
              variant="bold18"
              // fontWeight="bold"
            >
              Order Id:
            </Text>
            <Text
              fontSize={16}
              //  fontWeight="bold"
              variant="bold18">
              {item.id}
            </Text>
          </Box>
          <Box flexDirection="row" justifyContent="space-between" mb="s2">
            <Text fontSize={14}>Order Date:</Text>
            <Text
              fontSize={14}
              //  fontWeight="bold"
              variant="bold18">
              {orderDate}
            </Text>
          </Box>
          <Box flexDirection="row" justifyContent="space-between" mb="s2">
            <Text fontSize={14}>Grand Total:</Text>
            <Text
              fontSize={14}
              // fontWeight="bold"
              variant="bold18">
              ${calculatePrice(item.attributes?.totals?.grandTotal)}
            </Text>
          </Box>
          <Box flexDirection="row" justifyContent="space-between">
            <Text fontSize={14}>Status:</Text>
            <Text
              fontSize={14}
              // fontWeight="bold"
              variant="bold18"
              color={isDelivered ? 'green' : 'red'}>
              {isDelivered ? 'Delivered' : 'Not Delivered'}
            </Text>
          </Box>
        </Box>
      </TouchableOpacity>
    );
  };

  useEffect(() => {
    setIsLoading(true);
    dispatch(getOrdersData(`customers/${profileId}/orders`)).then(res => {
      setIsLoading(false);
    });
  }, [dispatch, profileId]);

  useEffect(() => {
    dispatch(getCustomerDetails('customers')).then(() => {});
  }, []);

  return (
    <Box flex={1} bg="white">
      <CommonHeader title="Your Orders" />
      {isLoading ? (
        <Box flex={1} alignItems="center" justifyContent="center">
          <ActivityIndicator color={theme.colors.sushiittoRed} />
        </Box>
      ) : (
        <Box flex={1} padding="paddingHorizontal">
          {ordersData.length > 0 ? (
            <FlatList
              data={ordersData}
              renderItem={renderItem}
              keyExtractor={item => item.id}
            />
          ) : (
            <Text>No orders found.</Text>
          )}
        </Box>
      )}
    </Box>
  );
};

export default YourOrdersScreen;
