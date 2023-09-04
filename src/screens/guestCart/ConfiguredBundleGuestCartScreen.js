/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {Box, Text} from '@atoms';
import {api} from '../../api/SecureAPI';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {CustomerCartIdApiAsyncThunk} from '../../redux/customerCartIdApi/CustomerCartIdApiAsyncThunk';
import {useDispatch, useSelector} from 'react-redux';
import {RemoveIcon} from '../../assets/svgs';
import {getCartDataNew} from '../../redux/newCartApi/NewCartApiAsyncThunk';
import {applicationProperties} from '../../utils/application.properties';
const ConfiguredBundleGuestCart = ({data}) => {
  console.log('data12312312: ', data?.templateUUID);
  return false;
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const newCartApiUrl = `${applicationProperties.baseUrl}/cart?cartId=${customerCartId}`;

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
        <Text fontSize={16} fontWeight="600">
          {data?.groupname}
        </Text>
        <Box flexDirection="row" alignItems="center">
          <TouchableOpacity onPress={() => removeItem(data?.groupKey)}>
            <Box mr="s10">
              <RemoveIcon />
            </Box>
          </TouchableOpacity>

          {isLoading ? (
            <ActivityIndicator />
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
              <Box alignItems="center" mr="s8" flex={1}>
                <Image
                  style={{height: 120, width: 120, resizeMode: 'contain'}}
                  source={{
                    uri: item?.['concrete-product-image-sets']?.imageSets?.[0]
                      ?.images?.[0]?.externalUrlLarge,
                  }}
                />
              </Box>
              <Box justifyContent="space-between">
                <Box>
                  <Box flexDirection="row">
                    <Text>{item?.['concrete-products']?.name}</Text>
                  </Box>
                  <Text style={{fontWeight: 'bold', marginTop: 4}}>
                    $ {item?.itemData?.attributes?.calculations?.sumGrossPrice}{' '}
                    x {data?.groupquantity} {''}
                    {''}
                    {item?.itemData?.attributes?.calculations?.sumGrossPrice *
                      data?.groupquantity}
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
export default ConfiguredBundleGuestCart;
