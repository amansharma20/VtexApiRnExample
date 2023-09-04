/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import React, {useEffect, useState} from 'react';
import {Box, Text, theme} from '@atoms';
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import CommonHeader from '../../components/CommonHeader/CommonHeader';
import {applicationProperties} from '../../utils/application.properties';
import {commonApi} from '../../api/CommanAPI';
import {FlashList} from '@shopify/flash-list';
const BundledProductsListScreen = props => {
  const navigation = useNavigation();

  const title = props.route.params?.title;
  const [bundeledProductIds, setBundeledProductIds] = useState([
    210, 211, 212, 214, 213, 215, 216, 217,
  ]);
  const [bundleProducts, setBundleProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const BundleProductItem = ({item}) => {
    const productItem = item.item;
    const productImage =
      item?.item?.[0]?.included?.[0]?.attributes.imageSets?.[0]?.images?.[0]
        ?.externalUrlSmall;
    return (
      <Box
        flex={1}
        marginHorizontal="s4"
        flexShrink={1}
        mb="s8"
        borderWidth={1}
        borderColor="border"
        borderRadius={8}
        padding="s8">
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('BundleProductDetailsScreen', {
              bundleProduct: productItem,
            });
          }}>
          <Box alignItems="center">
            <Image source={{uri: productImage}} style={styles.productImage} />
          </Box>
          <Text style={styles.productTitle} variant="bold18" numberOfLines={1}>
            {productItem[0]?.data?.attributes?.name}
          </Text>
          {/*
            <Box>
              <Text style={styles.productPrice}>$ {item.price}</Text>
            </Box> */}
        </TouchableOpacity>
      </Box>
    );
  };
  const renderItem = items => {
    return <BundleProductItem item={items} />;
  };

  useEffect(() => {
    setBundleProducts([]);
    const getBundeledProducts = async id => {
      setIsLoading(true);
      const response = await commonApi.get(
        `abstract-products/${id}?include=abstract-product-image-sets%2Cabstract-product-prices%2Cabstract-product-availabilities`,
      );
      setBundleProducts(prevBundleProducts => [
        ...prevBundleProducts,
        [response?.data?.data],
      ]);

      setIsLoading(false);
    };
    bundeledProductIds.map(id => {
      getBundeledProducts(id);
    });
  }, []);

  return (
    <Box flex={1} backgroundColor="white">
      <CommonHeader title={title} />
      <Box flex={1} paddingHorizontal="paddingHorizontal">
        {/* <Text>BundledProductsListScreen</Text> */}
        {!isLoading ? (
          <>
            <Box flex={1}>
              <FlashList
                data={bundleProducts}
                renderItem={renderItem}
                numColumns={2}
                contentContainerStyle={{paddingBottom: 40}}
                showsVerticalScrollIndicator={false}
              />
            </Box>
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

const styles = StyleSheet.create({
  productImage: {
    width: 150,
    height: 150,
    marginBottom: 8,
    backgroundColor: 'white',
    resizeMode: 'contain',
  },
  productTitle: {
    fontSize: 16,
    // fontWeight: 'bold',
    marginBottom: 4,
    maxWidth: Dimensions.get('screen').width / 2 - 60,
  },
  productPrice: {
    fontSize: 14,
    color: 'gray',
  },
});
export default BundledProductsListScreen;
