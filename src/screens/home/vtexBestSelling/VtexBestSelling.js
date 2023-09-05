import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Box, Text, theme} from '../../../atoms';
import {useNavigation} from '@react-navigation/native';
import Icons from '../../../assets/constants/Icons';
import axios from 'axios';

const VtexBestSelling = () => {
  const navigation = useNavigation();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  console.log('isLoading: ', isLoading);

  const renderItem = ({item}) => {
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
            navigation.navigate('ProductDetailsScreenVtex', {
              product: item,
            });
          }}>
          <Box alignItems="center">
            <Image
              source={{uri: item?.SkuImageUrl}}
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
            flexShrink={1}
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between">
            <Box maxWidth={'75%'}>
              <Text variant="bold18" numberOfLines={2} marginVertical="s8">
                {item?.ProductName}
              </Text>
            </Box>
            <Box flexShrink={1}>
              <TouchableOpacity
              //   onPress={
              //     isUserLoggedIn ? onPressAddToCart : onPressAddToCartGuestUser
              //   }
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
                  {/* {isLoading === true ? (
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
                )} */}
                  <Image
                    source={Icons.addToCartIcon}
                    style={{width: 24, height: 24, tintColor: 'white'}}
                  />
                </Box>
              </TouchableOpacity>
            </Box>
          </Box>

          <Box>
            <Text variant="bold16">$ {item?.listPrice}</Text>
          </Box>
        </TouchableOpacity>
      </Box>
    );
  };

  useEffect(() => {
    const apiUrl =
      'https://loopbact-test.onrender.com/vtex-best-selling-products';
    setIsLoading(true);
    axios
      .get(apiUrl)
      .then(response => {
        // Set the response data in the state
        setData(response.data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      });
  }, []);

  return (
    <Box flex={1}>
      <Text variant="semiBold24" textAlign="center">
        Best - Sellers
      </Text>
      <Box paddingHorizontal="paddingHorizontal" mt="s16">
        {isLoading === false ? (
          <>
            <FlatList
              data={data}
              renderItem={renderItem}
              keyExtractor={item => item.SkuId.toString()}
            />
          </>
        ) : (
          <>
            <ActivityIndicator color={theme.colors.sushiittoRed} />
          </>
        )}
      </Box>
    </Box>
  );
};

export default VtexBestSelling;

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
