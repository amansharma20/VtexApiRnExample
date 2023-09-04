import React, {useEffect, useState} from 'react';
import {Box, theme, Text} from '@atoms';
import {api} from '../../api/SecureAPI';
import {StyleSheet, Image, FlatList, ActivityIndicator} from 'react-native';
import CommonHeader from '../../components/CommonHeader/CommonHeader';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ScrollView} from 'react-native-gesture-handler';
import {commonApi} from '../../api/CommanAPI';
import CommonSolidButton from '../../components/CommonSolidButton/CommonSolidButton';
import {useIsUserLoggedIn} from '../../hooks/useIsUserLoggedIn';
import {useSelector, useDispatch} from 'react-redux';
import {getCustomerCartItems} from '../../redux/CartApi/CartApiAsyncThunk';
import {CustomerCartIdApiAsyncThunk} from '../../redux/customerCartIdApi/CustomerCartIdApiAsyncThunk';
import {useNavigation} from '@react-navigation/native';

const BundleProductDetailsScreen = props => {
  const {isUserLoggedIn} = useIsUserLoggedIn();
  const navigation = useNavigation();

  const dispatch = useDispatch();
  const [bundleProductArray, setBundleProductarray] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const bundleProduct = props?.route?.params?.bundleProduct;
  const product_concrete_ids =
    bundleProduct[0]?.data?.attributes?.attributeMap?.product_concrete_ids[0];
  const bundleProductImage =
    bundleProduct?.[0]?.included?.[0]?.attributes.imageSets?.[0]?.images?.[0]
      ?.externalUrlLarge;
  const productAvailability =
    bundleProduct?.[0]?.included?.[1]?.attributes?.availability;
  const bundleProductPrice =
    bundleProduct?.[0]?.included?.[2]?.attributes?.price;
  const renderItem = items => {
    const product = items?.item;
    return (
      <Box
        style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
        <Image
          style={{width: 50, height: 50, marginRight: 10}}
          source={{
            uri: product?.bundleProductImage,
          }}
        />
        <Box style={{display: 'flex', flexDirection: 'column'}}>
          <Text>{product?.productName}</Text>
          <Text>x {product?.quantity}</Text>
          <Text>{product?.price}</Text>
        </Box>
      </Box>
    );
  };
  const customerCart = useSelector(
    state => state.customerCartIdApiSlice?.customerCart?.data?.data?.[0] || [],
  );

  const addToCartHandler = async () => {
    if (product_concrete_ids) {
      const productData = {
        data: {
          type: 'items',
          attributes: {
            sku: product_concrete_ids,
            quantity: 1,
            salesUnit: {
              id: 0,
              amount: 0,
            },
            productOptions: [null],
          },
        },
      };
      setIsLoading(true);
      const response = await api.post(
        `carts/${customerCart.id}/items`,
        productData,
        isLoading,
      );
      if (response?.data?.status === 201) {
        dispatch(
          getCustomerCartItems(
            `carts/${customerCart.id}?include=items%2Cbundle-items`,
          ),
        ).then(res => {
          if (res.payload.status === 200) {
            setIsLoading(false);
            alert('Added to Cart');
          }
        });
        dispatch(CustomerCartIdApiAsyncThunk('carts')).then(() => {});
      } else {
        alert('error', response.data.data.errors?.[0]?.detail);
        setIsLoading(false);
      }
    }
  };
  const onPressAddToCart = () => {
    isUserLoggedIn ? addToCartHandler() : navigation.navigate('LoginScreen');
  };

  useEffect(() => {
    setIsLoading(true);
    const getConcreteProducts = async product_concrete_ids => {
      const response = await commonApi.get(
        `concrete-products/${product_concrete_ids}/bundled-products?include=concrete-products`,
      );

      const newArray = response?.data?.data?.data;
      const bundleProduct = [];
      newArray.map(async (item, index) => {
        response?.data?.data?.included?.[index]?.attributes?.name;
        const productImage = await commonApi.get(
          `concrete-products/${item.attributes.sku}/concrete-product-image-sets`,
        );

        const newObj = {
          quantity: item.attributes.quantity,
          sku: item.attributes.sku,
          productName:
            response?.data?.data?.included?.[index]?.attributes?.name,
          bundleProductImage:
            productImage?.data?.data?.data?.[0]?.attributes?.imageSets?.[0]
              ?.images?.[0]?.externalUrlSmall,
        };
        bundleProduct.push(newObj);
      });
      setIsLoading(false);
      setBundleProductarray(bundleProduct);
    };
    getConcreteProducts(product_concrete_ids);
  }, [product_concrete_ids]);
  return (
    <SafeAreaView style={styles.container}>
      <CommonHeader
        title={bundleProduct[0]?.data?.attributes?.name}
        showCartIcon
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: theme.spacing.paddingHorizontal,
          flexGrow: 1,
        }}>
        {bundleProduct ? (
          <Box style={styles.productDetails}>
            <Image
              style={styles.backImage}
              source={{
                uri: bundleProductImage,
              }}
            />
            <Box mt="s12">
              <Text
                // style={{fontWeight: 'bold'}}
                variant="bold18">
                {bundleProduct[0]?.data?.attributes?.name}
              </Text>
            </Box>
            <Text
              // style={{fontWeight: 'bold'}}
              variant="bold18">
              Description :{' '}
            </Text>
            <Text>{bundleProduct[0]?.data?.attributes?.description}</Text>
            <Box borderTopWidth={1} borderColor="border" mt="s8">
              <Text mt="s8" mb="s8">
                BUNDLE INCLUDES
              </Text>
              {!isLoading ? (
                <>
                  <ScrollView horizontal={true} style={{width: '100%'}}>
                    <FlatList
                      data={bundleProductArray}
                      renderItem={renderItem}
                    />
                  </ScrollView>
                </>
              ) : (
                <>
                  <ActivityIndicator color={theme.colors.sushiittoRed} />
                </>
              )}
            </Box>
            <Box borderTopWidth={1} borderColor="border" mt="s8">
              <Text
                mt="s6"
                //  style={{fontWeight: 'bold'}}
                variant="bold18">
                Price : $ {bundleProductPrice}
              </Text>
              {!productAvailability ? (
                <Text color="red">Product is not available </Text>
              ) : (
                <Text color="green">In stock</Text>
              )}
            </Box>
          </Box>
        ) : (
          <ActivityIndicator size="large" color={theme.colors.sushiittoRed} />
        )}
      </ScrollView>

      <Box paddingVertical="s16" paddingHorizontal="paddingHorizontal">
        <CommonSolidButton
          title={!isLoading ? 'Add to Cart' : 'Loading...'}
          onPress={!isLoading ? onPressAddToCart : () => {}}
        />
      </Box>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
  },
  backImage: {
    resizeMode: 'contain',
    width: '100%',
    height: 300,
  },
  bundleImage: {
    resizeMode: 'contain',
    width: '100%',
    height: 40,
  },
  item: {
    marginVertical: 8,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  title: {
    fontSize: 32,
  },

  cartButton: {
    width: '100%',
    marginVertical: 10,
    backgroundColor: 'gray',
    padding: 16,
    alignItems: 'center',
    borderRadius: 8,
  },
});

export default BundleProductDetailsScreen;
