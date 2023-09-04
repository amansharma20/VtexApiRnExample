/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {useCallback, useEffect, useState, useRef} from 'react';
import {
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  Alert,
} from 'react-native';
import {commonApi} from '../../api/CommanAPI';
import {api} from '../../api/SecureAPI';
import {useNavigation} from '@react-navigation/native';
import {Box, theme, Text} from '@atoms';
import CommonHeader from '../../components/CommonHeader/CommonHeader';
import {useIsUserLoggedIn} from '../../hooks/useIsUserLoggedIn';
import {useDispatch} from 'react-redux';
import {getCustomerCartItems} from '../../redux/CartApi/CartApiAsyncThunk';
import {CustomerCartIdApiAsyncThunk} from '../../redux/customerCartIdApi/CustomerCartIdApiAsyncThunk';
import {useSelector} from 'react-redux';
import CommonSolidButton from '../../components/CommonSolidButton/CommonSolidButton';
import CommonLoading from '../../components/CommonLoading';
import {getCustomerWishlist} from '../../redux/wishlist/GetWishlistApiAsyncThunk';
import ShoppingListItem from '../../components/ShoppingListItem';
import DynamicSnapPointBottomSheet from '../../components/bottomsheets/DynamicSnapPointBottomSheet';
import {getProductsByWishlistAsyncThunk} from '../../redux/wishlist/ProductsWishlistApiAsyncThunk';
import ProductOffer from './ProductOffer';
import axios from 'axios';
import {getCartDataNew} from '../../redux/newCartApi/NewCartApiAsyncThunk';
import {Toast} from 'react-native-toast-message/lib/src/Toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {guestCartData} from '../../redux/GuestCartApi/GuestCartApiAsyncThunk';
import {applicationProperties} from '../../utils/application.properties';
import {calculatePrice} from '../../utils/CommonFunctions';

const ProductDetailsScreen = props => {
  const propData = props.route.params.product;
  const abstractSku = props.route.params.product.abstractSku;

  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {isUserLoggedIn} = useIsUserLoggedIn();

  const bottomSheetRef = useRef(null);

  const handleExpandPress = useCallback(() => {
    bottomSheetRef.current?.expand();
  }, []);
  const handleClosePress = useCallback(() => {
    bottomSheetRef.current?.close();
  }, []);

  const customerCart = useSelector(
    state => state.customerCartIdApiSlice?.customerCart?.data?.data?.[0] || [],
  );

  const customerWishlist = useSelector(
    state => state?.getWishlistApiSlice?.customerWishlistData?.data?.data || [],
  );

  const [prodData, setProdData] = useState(null);
  const [selectedId, setSelectedId] = useState(0);
  const [variationIdData, setVariationIdData] = useState();
  const initialSkuId = variationIdData?.[selectedId];
  const [selectedSkuId, setSelectedSkuId] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingShopingList, setIsLoadingShopingList] = useState(false);
  const [productAvailability, setProductAvailability] = useState(true);
  const [selectedShoppingListId, setSelectedShoppingListId] = useState(
    customerWishlist?.[0]?.id,
  );
  const [productOffers, setProductOffers] = useState([]);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [offerForAddToCart, setOfferForAddToCart] = useState(null);
  console.log('offerForAddToCart: ', offerForAddToCart);
  const [selectedOfferIndex, setSelectedOfferIndex] = useState(0);
  const [productData, setProductData] = useState([]);
  const [isProductExistInShoppingList, setIsProductExistInShoppingList] =
    useState(false);

  const title = productData?.[selectedVariantIndex]?.attributes?.name;
  const image =
    productData?.[selectedVariantIndex]?.image?.attributes?.imageSets?.[0]
      ?.images?.[0]?.externalUrlLarge;
  const name = productData?.[selectedVariantIndex]?.attributes?.name;
  const brand =
    productData?.[selectedVariantIndex]?.attributes?.attributes?.brand;
  const description =
    productData?.[selectedVariantIndex]?.attributes?.description;
  console.log('description: ', description);

  const productOffer = productData?.[selectedVariantIndex]?.productOffers;

  const newCartApiUrl = `https://sushiitobff-dzt0m3.5sc6y6-2.usa-e2.cloudhub.io/carts?cartId=${customerCart.id}`;

  const onPressAddToCart = () => {
    isUserLoggedIn ? addToCartHandler() : onPressAddToCartGuestUser();
  };

  const addToCartAsAGuestUser = async guestCartDataReq => {
    CommonLoading.show();
    const guestCustomerUniqueId = await AsyncStorage.getItem(
      'guestCustomerUniqueId',
    );
    const url = `${applicationProperties.baseUrl}/guest-cart-items`;
    const headers = {
      'Content-Type': 'application/json',
      'X-Anonymous-Customer-Unique-Id': guestCustomerUniqueId,
    };
    await axios
      .post(url, guestCartDataReq, {headers: headers})
      .then(response => {
        console.log('response: ', response.status);
        if (response?.status === 201) {
          // Alert.alert('Added to cart');
          dispatch(
            guestCartData({
              endpoint: `${applicationProperties.baseUrl}/guest-carts?include=guest-cart-items%2Cbundle-items%2Cconcrete-products%2Cconcrete-product-image-sets%2Cconcrete-product-availabilities`,
              data: headers,
            }),
          );
          Toast.show({
            type: 'success',
            text1: 'Added to cart 🎉',
            position: 'top',
            onPress: () => {
              navigation.navigate('CartScreen');
            },
          });
        } else if (response?.status === 404) {
          Alert.alert('Cart not found');
          return;
        } else if (response?.status === 422) {
          Alert.alert('Product not found');
          return;
        } else {
          Alert.alert('Bad Request');
          return;
        }

        CommonLoading.hide();
      })
      .catch(error => {
        console.error('Error:', error);
        CommonLoading.hide();
      });
  };

  const onPressAddToCartGuestUser = async () => {
    const guestCartDataReq = {
      data: {
        type: 'guest-cart-items',
        attributes: {
          sku: selectedSkuId,
          quantity: 1,
          productOfferReference: offerForAddToCart?.productOfferReference,
          merchantReference: offerForAddToCart?.merchantReference,
        },
      },
    };
    const guestCustomerUniqueId = await AsyncStorage.getItem(
      'guestCustomerUniqueId',
    );

    if (!guestCustomerUniqueId) {
      const guestUserUniqueId = 'id' + Math.random().toString(16).slice(2);
      AsyncStorage.setItem('guestCustomerUniqueId', guestUserUniqueId);
      addToCartAsAGuestUser(guestCartDataReq);
    } else {
      addToCartAsAGuestUser(guestCartDataReq);
    }
  };

  const onPressAddToShoppingList = () => {
    isUserLoggedIn
      ? addToShoppingListHandler()
      : navigation.navigate('LoginScreen');
  };

  console.log(
    'offerForAddToCart?.merchantReference: ',
    offerForAddToCart?.merchantReference,
  );
  const addToCartHandler = async () => {
    if (selectedSkuId) {
      const productData = {
        data: {
          type: 'items',
          attributes: {
            sku: selectedSkuId,
            quantity: 1,
            productOfferReference: offerForAddToCart?.productOfferReference,
            merchantReference: offerForAddToCart?.merchantReference,
            salesUnit: {
              id: 0,
              amount: 0,
            },
            productOptions: [null],
          },
        },
      };
      console.log('productData: ', productData);

      CommonLoading.show();
      const response = await api.post(
        `carts/${customerCart.id}/items`,
        productData,
      );
      if (response?.data?.status === 201) {
        dispatch(getCartDataNew(newCartApiUrl)).then(res => {
          if (res.payload.status === 200) {
            console.log('carts api call successful');
            CommonLoading.hide();
            Toast.show({
              type: 'success',
              text1: 'Added to cart 🎉',
              position: 'top',
              onPress: () => {
                navigation.navigate('CartScreen');
              },
            });
          } else {
            CommonLoading.hide();
            console.log('mulesoft carts api call not successful');
          }
        });
        dispatch(CustomerCartIdApiAsyncThunk('carts')).then(() => {});
      } else {
        Alert.alert('Error', response.data.data.errors?.[0]?.detail, [
          {
            text: 'OK',
          },
        ]);
        CommonLoading.hide();
      }
    }
  };

  const selectShoppingList = () => {
    handleExpandPress();
  };

  const addToShoppingListHandler = async () => {
    setIsLoadingShopingList(true);
    if (selectedSkuId) {
      const productData = {
        data: {
          type: 'shopping-list-items',
          attributes: {
            productOfferReference: null,
            quantity: 1,
            sku: selectedSkuId,
          },
        },
      };
      const response = await api.post(
        `shopping-lists/${selectedShoppingListId}/shopping-list-items`,
        productData,
      );
      if (response?.data?.status === 201) {
        setIsLoadingShopingList(false);
        dispatch(getCustomerWishlist('shopping-lists')).then(() => {});
        handleClosePress();
        dispatch(
          getProductsByWishlistAsyncThunk(
            `shopping-lists/${selectedShoppingListId}?include=shopping-list-items%2Cconcrete-products%2Cconcrete-product-image-sets%2Cconcrete-product-prices`,
          ),
        );
        checkIfAddedInShoppingList();
        alert('Added to shopping list');
      } else {
        setIsLoadingShopingList(false);
        Alert.alert('Error', response.data.data.errors?.[0]?.detail, [
          {
            text: 'OK',
          },
        ]);
      }
    }
  };

  useEffect(() => {
    setProdData(propData);
    dispatch(CustomerCartIdApiAsyncThunk('carts')).then(() => {});
    const fetchProductData = async () => {
      setIsLoading(true);
      const res = await axios
        .get(
          // `https://zaynproject-5g04sc.5sc6y6-1.usa-e2.cloudhub.io/abstract-product?pid=${abstractSku}&include=concrete-product-image-sets%2Cconcrete-product-prices%2Cconcrete-product-availabilities%2Cproduct-labels%2Cproduct-options%2Cproduct-reviews%2Cproduct-measurement-units%2Csales-units%2Cbundled-products%2Cproduct-offers`,
          `https://sushiitobff-dzt0m3.5sc6y6-2.usa-e2.cloudhub.io/pdp?pid=${abstractSku}&include=concrete-product-image-sets%2Cconcrete-product-prices%2Cconcrete-product-availabilities%2Cproduct-labels%2Cproduct-options%2Cproduct-reviews%2Cproduct-measurement-units%2Csales-units%2Cbundled-products%2Cproduct-offers`,
        )
        .catch(function (error) {
          setIsLoading(false);
          if (error) {
            Alert.alert('Error', 'something went wrong', [
              {
                text: 'OK',
              },
            ]);
          }
        });
      setProductData(res?.data);
      setSelectedSkuId(res?.data?.[0]?.id);
      setIsLoading(false);
    };
    fetchProductData();
  }, [propData, abstractSku]);

  const checkIfAddedInShoppingList = sku => {
    const productIds = [];

    productsByWishlist?.included?.forEach(element => {
      if (element.type == 'concrete-products') {
        productIds.push({
          id: element.id,
        });
      }
    });

    const idExists = productIds.some(item => item.id === sku);

    if (idExists) {
      setIsProductExistInShoppingList(true);
    } else {
      setIsProductExistInShoppingList(false);
    }
  };

  useEffect(() => {
    checkIfAddedInShoppingList(selectedSkuId);

    const fetchProductOffers = async () => {
      const response = await commonApi.get(
        `concrete-products/${selectedSkuId}/product-offers`,
        '',
      );
      const offerArray = response.data.data.data;
      if (response.data?.status === 200) {
        setProductOffers(offerArray);
        setOfferForAddToCart({
          productOfferReference: offerArray[0]?.id,
          merchantReference:
            response.data.data.data?.[0]?.attributes?.merchantReference,
          price: null,
        });
      } else {
      }
    };

    fetchProductOffers();
  }, [selectedSkuId]);

  const productsByWishlist = useSelector(
    state =>
      state?.getProductsByWishlistApiSlice?.productsByWishlist?.data || [],
  );

  useEffect(() => {
    dispatch(
      getProductsByWishlistAsyncThunk(
        `shopping-lists/${selectedShoppingListId}?include=shopping-list-items%2Cconcrete-products%2Cconcrete-product-image-sets%2Cconcrete-product-prices`,
      ),
    );
  }, [selectedShoppingListId]);

  useEffect(() => {
    setSelectedSkuId(initialSkuId);
  }, [initialSkuId]);

  const Row = ({title, value}) => {
    return (
      <Box flexDirection="row">
        <Text variant="regular16">{title}</Text>
        <Text variant="regular16">{value}</Text>
      </Box>
    );
  };

  const Item = ({item, onPress, backgroundColor, textColor}) => {
    const attr = item?.attributes?.attributes;
    const keys = Object.keys(attr);
    const lastKey = keys[keys.length - 1];
    const lastValue = attr[lastKey];

    return (
      <TouchableOpacity
        onPress={() => {
          setSelectedSkuId(item?.id);
        }}
        style={[styles.item, {backgroundColor}]}>
        <Text style={[styles.title, {color: textColor}]}>{lastValue}</Text>
      </TouchableOpacity>
    );
  };
  const renderItem = ({item, index}) => {
    const backgroundColor =
      item.id == selectedSkuId ? theme.colors.lightGrey : '#FFF';
    const color = item.id == selectedSkuId ? 'white' : 'black';

    return (
      <Item
        item={item}
        onPress={() => {
          setSelectedSkuId(item?.id);
          setSelectedVariantIndex(index);
          checkIfAddedInShoppingList(item.id.toString(), item.id);
        }}
        backgroundColor={backgroundColor}
        textColor={color}
      />
    );
  };

  // const productOfferDataForAddToCart = (offer, price, index) => {
  //   setSelectedOfferIndex(index);
  //   setOfferForAddToCart({
  //     productOfferReference: offer.id,
  //     merchantReference: offer.attributes.merchantReference,
  //     price: price?.attributes?.price,
  //   });
  // };
  const productOfferDataForAddToCart = (offer, price, index) => {
    setSelectedOfferIndex(index);
  };
  return (
    <SafeAreaView style={styles.container}>
      <CommonHeader title={title} showCartIcon />
      {isLoading ? (
        <ActivityIndicator color={theme.colors.sushiittoRed} />
      ) : (
        <>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: theme.spacing.paddingHorizontal,
              flexGrow: 1,
            }}>
            {prodData && productData ? (
              <Box style={styles.productDetails}>
                <Image
                  style={styles.backImage}
                  source={{
                    uri: image,
                  }}
                />
                <Box>
                  {/* <Text variant="regular18">{name}</Text> */}
                  {/* <Row title={'Brand : '} value={brand} /> */}
                  <Box>
                    {productData?.length >= 2 && (
                      <Box>
                        <Text variant="bold16" mt="s4">
                          Choose Variation :{' '}
                        </Text>
                        <FlatList
                          data={productData}
                          renderItem={({item, index}) =>
                            renderItem({item, index})
                          }
                          // keyExtractor={item => item.id}
                          // extraData={selectedId}
                          keyExtractor={(item, index) => index.toString()}
                          contentContainerStyle={styles.productList}
                        />
                      </Box>
                    )}
                  </Box>
                </Box>
                <Text variant="bold16" marginVertical="s4">
                  Description :{' '}
                </Text>
                <Text>{description}</Text>
                <Text
                  mt="s6"
                  variant="regular16"
                  // style={{fontWeight: 'bold'}}
                >
                  {productOffer != null
                    ? ''
                    : `Price $${calculatePrice(
                        productData?.[selectedVariantIndex]?.price?.attributes
                          ?.price,
                      )}`}
                </Text>
                {productData?.[selectedVariantIndex]?.availability?.attributes
                  ?.availability !== true ? (
                  <Text color="red">Product is not available </Text>
                ) : (
                  <Text color="green" marginBottom="s6">
                    In stock
                  </Text>
                )}
                {productData?.[selectedVariantIndex]?.productOffers != null ? (
                  <FlatList
                    data={productOffers}
                    renderItem={offers => {
                      return (
                        <ProductOffer
                          offers={offers}
                          productOfferDataForAddToCart={
                            productOfferDataForAddToCart
                          }
                          selectedOfferIndex={selectedOfferIndex}
                          setSelectedOfferIndex={setSelectedOfferIndex}
                        />
                      );
                    }}
                  />
                ) : (
                  ''
                )}
              </Box>
            ) : (
              <ActivityIndicator
                size="large"
                color={theme.colors.sushiittoRed}
              />
            )}
          </ScrollView>

          <Box
            padding="s16"
            backgroundColor="white"
            style={theme.cardVariants.bottomButtonShadow}>
            <CommonSolidButton
              title={!isLoading ? 'Add to Cart' : 'Loading...'}
              // onPress={addToCartHandler}
              onPress={!isLoading ? onPressAddToCart : () => {}}
              // onPress={onPressAddToCart}
              disabled={!productAvailability}
            />
            {/* <Box mt="s8">
              <TouchableOpacity
                style={styles.wishListContainer}
                onPress={selectShoppingList}>
                <Text style={{color: 'white', fontWeight: 'bold'}}>
                  {isLoadingShopingList ? 'Loading...' : 'Add to Shopping List'}
                </Text>
              </TouchableOpacity>
            </Box> */}
          </Box>

          <DynamicSnapPointBottomSheet
            handleExpandPress={handleExpandPress}
            bottomSheetRef={bottomSheetRef}>
            <Box flex={1} padding="s16">
              <Text fontSize={18} variant="bold16" pb="s12">
                Please select the shopping list -
              </Text>
              <FlatList
                data={customerWishlist}
                renderItem={(item, index) => {
                  return (
                    <ShoppingListItem
                      item={item}
                      onPress={() => {
                        setSelectedShoppingListId(item?.item?.id);
                      }}
                      index={index}
                      selectedShoppingListId={selectedShoppingListId}
                      showCheckMark={true}
                    />
                  );
                }}
              />
              <CommonSolidButton
                title={'Continue'}
                onPress={onPressAddToShoppingList}
              />
            </Box>
          </DynamicSnapPointBottomSheet>
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
  },
  productList: {
    paddingHorizontal: 16,
  },

  backImage: {
    resizeMode: 'contain',
    width: '100%',
    height: 200,
  },
  item: {
    marginVertical: 8,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  title: {
    fontSize: 32,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cartButton: {
    width: '100%',
    marginVertical: 10,
    backgroundColor: 'gray',
    padding: 16,
    alignItems: 'center',
    borderRadius: 8,
  },
  wishListContainer: {
    width: '100%',
    height: 40,
    backgroundColor: theme.colors.red,
    borderRadius: theme.spacing.lml,
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
    color: 'white',
  },
});

export default ProductDetailsScreen;
