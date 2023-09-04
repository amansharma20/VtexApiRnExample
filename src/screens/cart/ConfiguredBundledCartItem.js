/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {Box, Text, theme} from '@atoms';
import {api} from '../../api/SecureAPI';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {CustomerCartIdApiAsyncThunk} from '../../redux/customerCartIdApi/CustomerCartIdApiAsyncThunk';
import {useDispatch} from 'react-redux';
import {RemoveIcon} from '../../assets/svgs';
import {getCartDataNew} from '../../redux/newCartApi/NewCartApiAsyncThunk';
import {calculatePrice} from '../../utils/CommonFunctions';

const ConfiguredBundledCartItem = ({data, customerCartId}) => {
  console.log('data: ', data.attributes?.[0]?.itemData);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const newCartApiUrl = `https://sushiitobff-dzt0m3.5sc6y6-2.usa-e2.cloudhub.io/carts?cartId=${customerCartId}`;

  const changeQuantity = async (templateUUID, data, quantity) => {
    setIsLoading(true);
    const groupKey = data[0]?.itemData?.attributes?.configuredBundle?.groupKey;

    const items = data.map(item => {
      return {
        sku: item.itemData?.attributes?.sku,
        quantity: quantity,
        slotUuid: item.itemData?.attributes?.configuredBundleItem?.slot?.uuid,
      };
    });

    const productCart = {
      data: {
        type: 'configured-bundles',
        attributes: {
          quantity: quantity,
          templateUuid: templateUUID,
          items: items,
        },
      },
    };

    const resp = await api.patch(
      `carts/${customerCartId}/configured-bundles/${groupKey}`,
      JSON.stringify(productCart),
    );
    const response = resp.data;
    if (response) {
      dispatch(getCartDataNew(newCartApiUrl)).then(res => {
        if (res.payload.status === 200) {
          console.log('carts api call successful');
          setIsLoading(false);
        } else {
          console.log('mulesoft carts api call not successful');
          setIsLoading(false);
        }
      });
      // dispatch(
      //   getCustomerCartItems(
      //     `carts/${customerCartId}?include=items%2Cbundle-items`,
      //   ),
      // ).then(error => {
      //   console.log('error: ', error);
      // });
      dispatch(CustomerCartIdApiAsyncThunk('carts')).then(() => {});
      // setIsLoading(false);
    } else {
    }
  };

  const removeItem = async groupKey => {
    setIsLoading(true);

    const response = await api.Delete(
      `carts/${customerCartId}/configured-bundles/${groupKey}`,
      '',
    );
    // setIsLoading(false);

    // dispatch(
    //   getCustomerCartItems(
    //     `carts/${customerCartId}?include=items%2Cbundle-items`,
    //   ),
    // ).then(error => {
    //   console.log('error: ', error);
    // });

    dispatch(getCartDataNew(newCartApiUrl)).then(res => {
      if (res.payload.status === 200) {
        console.log('carts api call successful');
        setIsLoading(false);
      } else {
        console.log('mulesoft carts api call not successful');
        setIsLoading(false);
      }
    });

    dispatch(CustomerCartIdApiAsyncThunk('carts')).then(() => {});
    console.log(response);
  };

  return (
    <Box
      borderRadius={8}
      borderColor="border"
      borderWidth={1}
      mb="s8"
      padding="s8"
      backgroundColor="white"
      flex={1}>
      <Box
        flexDirection="row"
        flex={1}
        alignItems="center"
        justifyContent="space-between"
        mb="s8">
        <Text
          fontSize={16}
          //  fontWeight="600"
          variant="bold16">
          {data?.groupname}
        </Text>
        <Box flexDirection="row" alignItems="center">
          {/* <Box mr="s10">
            <TouchableOpacity onPress={() => removeItem(data?.groupKey)}>
              <Box>
                <RemoveIcon />
              </Box>
            </TouchableOpacity>
          </Box> */}

          {isLoading ? (
            <ActivityIndicator color={theme.colors.sushiittoRed} />
          ) : (
            <>
              <TouchableOpacity
                onPress={() => {
                  data?.groupquantity > 1
                    ? changeQuantity(
                        data?.templateUuid,
                        data?.attributes,
                        data?.groupquantity - 1,
                      )
                    : removeItem(data?.groupKey);
                }}>
                <Text style={styles.quantityText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.quantity}>{data?.groupquantity}</Text>
              <TouchableOpacity
                onPress={() => {
                  changeQuantity(
                    data?.templateUuid,
                    data?.attributes,
                    data?.groupquantity + 1,
                  );
                }}>
                <Text style={styles.quantityText}>+</Text>
              </TouchableOpacity>
            </>
          )}
        </Box>
      </Box>

      {data?.attributes.map(item => {
        const price =
          item?.itemData?.attributes?.calculations?.sumGrossPrice ||
          item?.itemData?.attributes?.calculations?.sumNetPrice;

        // setTemplatePrice(templatePrice + item.price * data.quantity);
        return (
          <Box
            borderRadius={8}
            borderColor="border"
            borderWidth={1}
            mb="s8"
            padding="s8"
            flex={1}
            key={item.sku}>
            <Box flexDirection="row" flex={1}>
              <Box alignItems="center" mr="s8" height={120} width={120}>
                <Image
                  style={{
                    height: 120,
                    width: 120,
                    resizeMode: 'cover',
                    borderRadius: 8,
                  }}
                  source={{
                    uri: item?.['concrete-product-image-sets']?.imageSets?.[0]
                      ?.images?.[0]?.externalUrlLarge,
                  }}
                />
              </Box>
              <Box flex={1}>
                <Box>
                  <Text>{item?.['concrete-products']?.name}</Text>
                </Box>
                <Box>
                  <Text style={{fontWeight: 'bold', marginTop: 4}}>
                    $ {calculatePrice(price)}
                  </Text>
                </Box>
              </Box>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};

const styles = StyleSheet.create({
  quantityText: {
    fontSize: 24,
    color: 'black',
  },
  quantity: {
    fontSize: 20,
    marginHorizontal: 10,
  },
});
export default ConfiguredBundledCartItem;
