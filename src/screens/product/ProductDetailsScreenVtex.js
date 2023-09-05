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
  //   const propData = props.route.params.product;
  //   const abstractSku = props.route.params.product.abstractSku;
  const abstractSku = '40000038';

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
  console.log('productData: ', productData);
  const [isProductExistInShoppingList, setIsProductExistInShoppingList] =
    useState(false);

  const [productImage, setProductImage] = useState(null);

  const title = productData?.name;
  const image = productData?.skus?.[selectedVariantIndex]?.image;
  const name = productData?.skus?.[selectedVariantIndex]?.skuname;
  const price = productData?.skus?.[selectedVariantIndex]?.bestPrice;

  const brand =
    productData?.[selectedVariantIndex]?.attributes?.attributes?.brand;
  const description =
    productData?.[selectedVariantIndex]?.attributes?.description;

  const productOffer = productData?.[selectedVariantIndex]?.productOffers;

  useEffect(() => {
    // setProdData(propData);
    dispatch(CustomerCartIdApiAsyncThunk('carts')).then(() => {});
    const fetchProductData = async () => {
      setIsLoading(true);
      const res = await axios
        .get(
          // `https://zaynproject-5g04sc.5sc6y6-1.usa-e2.cloudhub.io/abstract-product?pid=${abstractSku}&include=concrete-product-image-sets%2Cconcrete-product-prices%2Cconcrete-product-availabilities%2Cproduct-labels%2Cproduct-options%2Cproduct-reviews%2Cproduct-measurement-units%2Csales-units%2Cbundled-products%2Cproduct-offers`,
          //   `https://sushiitobff-dzt0m3.5sc6y6-2.usa-e2.cloudhub.io/pdp?pid=${abstractSku}&include=concrete-product-image-sets%2Cconcrete-product-prices%2Cconcrete-product-availabilities%2Cproduct-labels%2Cproduct-options%2Cproduct-reviews%2Cproduct-measurement-units%2Csales-units%2Cbundled-products%2Cproduct-offers`,
          `${applicationProperties.vtexBaseUrl}/get-vtex-product-by-id/${abstractSku}`,
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
      console.log('res?.data: ', res?.data);
      setSelectedSkuId(res?.data?.skus?.[0]?.sku);
      setIsLoading(false);
    };
    fetchProductData();
  }, [abstractSku]);

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

  const Row = ({title, value}) => {
    return (
      <Box flexDirection="row">
        <Text variant="regular16">{title}</Text>
        <Text variant="regular16">{value}</Text>
      </Box>
    );
  };

  const Item = ({item, onPress, backgroundColor, textColor, index}) => {
    const name = item?.skuname;
    return (
      <TouchableOpacity
        onPress={() => {
          setSelectedSkuId(item?.sku);
          setSelectedVariantIndex(index);
        }}
        style={[styles.item, {backgroundColor}]}>
        <Text style={[styles.title, {color: textColor}]}>{name}</Text>
      </TouchableOpacity>
    );
  };
  const renderItem = ({item, index}) => {
    const backgroundColor =
      item.sku == selectedSkuId ? theme.colors.lightGrey : '#FFF';
    const color = item.sku == selectedSkuId ? 'white' : 'black';

    return (
      <Item
        item={item}
        onPress={() => {
          setSelectedSkuId(item?.sku);
          setSelectedVariantIndex(index);
        }}
        backgroundColor={backgroundColor}
        textColor={color}
        index={index}
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
            {productData ? (
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
                    {productData?.skus?.length >= 2 && (
                      <Box>
                        <Text variant="bold16" mt="s4">
                          Choose Variation :{' '}
                        </Text>
                        <FlatList
                          data={productData?.skus}
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
                {/* <Text variant="bold16" marginVertical="s4">
                  Description :{' '}
                </Text>
                <Text>{description}</Text> */}
                <Text
                  mt="s6"
                  variant="regular16"
                  // style={{fontWeight: 'bold'}}
                >
                  {/* {productOffer != null
                    ? ''
                    : `Price $${calculatePrice(
                        productData?.[selectedVariantIndex]?.price?.attributes
                          ?.price,
                      )}`} */}
                  Pice ${productData?.skus?.[selectedVariantIndex]?.bestPrice}
                </Text>
                {productData?.available !== true ? (
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
              // onPress={onPressAddToCart}
              disabled={!productAvailability}
            />
          </Box>
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
