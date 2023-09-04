/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {useEffect, useState} from 'react';
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {SyncedList} from './components';
import axios from 'axios';
import ProductItemNew from '../../components/ProductItemNew';
import Box from '../../atoms/box';
import HomeShimmers from '../../components/shimmers/HomeShimmers';
import HomeCartPopUp from './components/HomeCartPopUp';
import {getCartDataNew} from '../../redux/newCartApi/NewCartApiAsyncThunk';
import {useDispatch, useSelector} from 'react-redux';
import {guestCartData} from '../../redux/GuestCartApi/GuestCartApiAsyncThunk';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {applicationProperties} from '../../utils/application.properties';
import {createCustomerCart} from '../../redux/createCustomerCart/CreateCustomerCartApiAsyncThunk';
import {CustomerCartIdApiAsyncThunk} from '../../redux/customerCartIdApi/CustomerCartIdApiAsyncThunk';

const SushittoHomeScreen = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const [apiData, setApiData] = useState([]);
  // console.log('apiData: ', apiData);

  useEffect(() => {
    setIsLoading(true);
    try {
      const fetchData = async () => {
        await axios
          .get(
            // 'https://categoriestree-5g04sc.5sc6y6-2.usa-e2.cloudhub.io/catalogsearch',
            `${applicationProperties.bffBaseUrl}category-trees`,
          )
          .then(response => {
            setApiData(response.data);
            setIsLoading(false);
          });
      };
      fetchData();
    } catch (error) {
      console.log('error: ', error);
      setIsLoading(false);
    }
  }, []);

  const customerCartId = useSelector(
    state =>
      state.customerCartIdApiSlice?.customerCart?.data?.data?.[0]?.id || '',
  );

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
    } else {
      const data = applicationProperties.createCartData;
      dispatch(
        createCustomerCart({endpoint: 'carts', data: JSON.stringify(data)}),
      ).then(() => {
        dispatch(CustomerCartIdApiAsyncThunk('carts')).then(() => {
          dispatch(getCartDataNew(newCartApiUrl));
        });
      });
    }
  }, [customerCartId]);

  useEffect(() => {
    const guestCart = async () => {
      const guestCustomerUniqueId = await AsyncStorage.getItem(
        'guestCustomerUniqueId',
      );

      if (guestCustomerUniqueId) {
        const headers = {
          'X-Anonymous-Customer-Unique-Id': guestCustomerUniqueId,
        };
        dispatch(
          guestCartData({
            endpoint:
              'https://glue.de.faas-suite-prod.cloud.spryker.toys/guest-carts?include=guest-cart-items%2Cbundle-items%2Cconcrete-products%2Cconcrete-product-image-sets%2Cconcrete-product-availabilities',
            data: headers,
          }),
        ).then(() => {
          console.log('redux called successfully');
        });
      }
    };
    guestCart();
  }, []);

  const renderHorizontalItem = (
    // @ts-ignore
    index: number,
    isSelected: boolean,
    item: any,
  ) => {
    return (
      <View style={styles.horizontalItemWrapper}>
        <View
          style={
            isSelected
              ? [styles.itemContainer, styles.itemContainerSelected]
              : styles.itemContainer
          }>
          <Text>{item.title}</Text>
        </View>
      </View>
    );
  };

  const renderVerticalItem = (item: any, index: Number) => {
    return (
      <Box backgroundColor="white" paddingHorizontal="paddingHorizontal">
        <ProductItemNew
          item={item?.attributes}
          includedData={undefined}
          index={index}
        />
      </Box>
    );
  };

  const renderSectionHeader = (section: any) => {
    return (
      <View style={styles.headerContainer}>
        <View style={styles.innerHeaderContainer}>
          <Text style={styles.header}>{section.title}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container]}>
      {/* <CommonHeader title={'Sushiitto Menu'} onPress={undefined} showCartIcon /> */}

      {isLoading ? (
        <>
          <HomeShimmers />
        </>
      ) : (
        <SyncedList
          // data={listData}
          // data={DUMMYDATA.data.Menu}
          data={apiData}
          horizontalListContainerStyle={styles.horizontalListContainerStyle}
          // renderHorizontalItem={renderHorizontalItem}
          // renderSectionHeader={renderSectionHeader}
          renderVerticalItem={renderVerticalItem}
        />
      )}
      <HomeCartPopUp />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    color: 'white',
  },
  headerContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 8,
    paddingHorizontal: 24,
    // paddingTop: 48,
    backgroundColor: 'green',
    height: 48,
  },
  horizontalItemWrapper: {
    borderRadius: 7,
    overflow: 'hidden',
  },
  horizontalListContainerStyle: {
    paddingBottom: 6,
  },
  innerHeaderContainer: {
    backgroundColor: 'gray',
    borderRadius: 3,
    height: 23,
    justifyContent: 'center',
    width: '100%',
  },
  itemContainer: {
    borderRadius: 7,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  itemContainerSelected: {
    backgroundColor: 'lightblue',
  },
  verticalItemContainer: {
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderBottomColor: 'rgba(0,0,0,0.3)',
    borderBottomWidth: 4,
    marginBottom: 8,
    paddingHorizontal: 32,
    paddingVertical: 16,
  },
});

export default SushittoHomeScreen;
