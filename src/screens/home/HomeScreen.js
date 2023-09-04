/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useCallback, useEffect} from 'react';
import {StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import CategorySection from './categorySection/CategorySection';
import {Box, Text, theme} from '@atoms';
import ContentFullSection from './contentFull/ContentFullSection';
import {SearchIconBlack} from '../../assets/svgs';
import {useNavigation} from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import Icons from '../../assets/constants/Icons';
import HomeHeader from './homeHeader/HomeHeader';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import SelectShippingMethod from '../../components/SelectShippingMethod/SelectShippingMethod';
import {getCartDataNew} from '../../redux/newCartApi/NewCartApiAsyncThunk';
import {useDispatch, useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {guestCartData} from '../../redux/GuestCartApi/GuestCartApiAsyncThunk';

const HomeScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();

  const customerCartId = useSelector(
    state =>
      state.customerCartIdApiSlice?.customerCart?.data?.data?.[0]?.id || '',
  );
  const ViewData = [
    'HomeHeader',
    'ContentFullSection',
    'SelectShippingMethod',
    'CategorySection',
  ];

  const renderHomeItems = useCallback(({item}) => {
    switch (item) {
      case 'HomeHeader':
        return <HomeHeader />;

      case 'ContentFullSection':
        return <ContentFullSection />;

      case 'SelectShippingMethod':
        return <SelectShippingMethod />;

      case 'CategorySection':
        return <CategorySection />;

      default:
        return <></>;
    }
  }, []);

  const newCartApiUrl = `https://sushiitobff-dzt0m3.5sc6y6-2.usa-e2.cloudhub.io/carts?cartId=${customerCartId}`;

  useEffect(() => {
    if (customerCartId) {
      dispatch(getCartDataNew(newCartApiUrl)).then(res => {
        if (res.payload.status === 200) {
          console.log('carts api call successful');
        } else {
          console.log('mulesoft carts api call not successful');
        }
      });
    }
  }, [customerCartId]);

  return (
    <Box flex={1} backgroundColor="white">
      {/* <Box
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        paddingHorizontal="paddingHorizontal"
        backgroundColor="white"
        mb="s4"
        paddingVertical="s4">
        <Text style={styles.title}>Browse</Text>
        <TouchableOpacity
          style={{padding: 4}}
          onPress={() => navigation.navigate('SearchScreen')}>
          <SearchIconBlack />
        </TouchableOpacity>
      </Box> */}
      <FlatList
        data={ViewData}
        renderItem={renderHomeItems}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: insets.top,
        }}
      />
    </Box>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    // marginBottom: 16,
  },
});

export default HomeScreen;
