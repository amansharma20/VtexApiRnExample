/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import Box from '../../atoms/box';
import Text from '../../atoms/text';
import CommonHeader from '../../components/CommonHeader/CommonHeader';
import {api} from '../../api/SecureAPI';
import {getCustomerWishlist} from '../../redux/wishlist/GetWishlistApiAsyncThunk';
import {useSelector, useDispatch} from 'react-redux';
import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {TextInput} from 'react-native-gesture-handler';
import CommonSolidButton from '../../components/CommonSolidButton/CommonSolidButton';
import {theme} from '@atoms';

const WishlistScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [wishlistName, setWishlistName] = useState('');
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const customerWishlist = useSelector(
    state => state?.getWishlistApiSlice?.customerWishlistData?.data?.data || [],
  );

  const addNewWishlist = async () => {
    const wishlistPayload = {
      data: {
        type: 'shopping-lists',
        attributes: {
          name: wishlistName,
        },
      },
    };
    const resp = await api.post(
      `shopping-lists`,
      JSON.stringify(wishlistPayload),
    );
    if (resp?.data?.status === 201) {
      setWishlistName('');
      dispatch(getCustomerWishlist('shopping-lists')).then(res => {
        if (res.payload.status === 200) {
          alert('Wishlist added successfully');
        }
      });
    } else {
      alert('error');
    }
  };

  useEffect(() => {
    setIsLoading(true);
    dispatch(getCustomerWishlist('shopping-lists')).then(() => {
      setIsLoading(false);
    });
  }, []);

  const renderItem = item => {
    const wishlist = item?.item?.attributes;
    return (
      <Box style={styles.wishlistItemContainer}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('WishlistItemsScreen', {id: item?.item?.id});
          }}
          style={styles.quantityButton}>
          <Text style={styles.wishlistItemName}>{wishlist.name}</Text>
          <Text style={styles.wishlistItemNumberOfItems}>
            Total Items :
            {wishlist.numberOfItems !== null ? wishlist.numberOfItems : '0'}
          </Text>
        </TouchableOpacity>
      </Box>
    );
  };
  return (
    <ScrollView>
      <Box flex={1} backgroundColor="white">
        <CommonHeader title="Shopping List" />
        <Box
          flex={1}
          backgroundColor="white"
          paddingHorizontal="paddingHorizontal">
          <Box>
            <Box
              backgroundColor="white"
              borderRadius={8}
              borderWidth={1}
              mb="s6"
              flexDirection="row">
              <TextInput
                placeholder="Enter Name here"
                placeholderTextColor="gray"
                onChangeText={text => {
                  setWishlistName(text);
                }}
                style={{paddingVertical: 10, paddingHorizontal: 4}}
              />
            </Box>
            <CommonSolidButton
              title="Add new Shopping list"
              onPress={() => addNewWishlist()}
            />
            <Text mt="s8" variant="bold18" style={styles.title}>
              Your Shopping List
            </Text>
            {isLoading ? (
              <ActivityIndicator color={theme.colors.sushiittoRed} />
            ) : (
              <FlatList
                data={customerWishlist}
                renderItem={renderItem}
                contentContainerStyle={{paddingBottom: 10}}
              />
            )}
          </Box>
        </Box>
      </Box>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    // fontWeight: 'bold',
    marginBottom: 8,
  },
  wishlistItemContainer: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 8,
    backgroundColor: 'white',
    borderRadius: 8,
  },
  wishlistItemName: {
    fontSize: 16,
  },
});

export default WishlistScreen;
