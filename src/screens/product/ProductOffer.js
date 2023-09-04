/* eslint-disable react-hooks/exhaustive-deps */
import React, {useCallback, useEffect, useState} from 'react';
import {TouchableOpacity} from 'react-native';
import {Box, theme, Text} from '@atoms';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import {commonApi} from '../../api/CommanAPI';
import {calculatePrice} from '../../utils/CommonFunctions';

const ProductOffer = ({
  offers,
  productOfferDataForAddToCart,
  selectedOfferIndex,
}) => {
  const offer = offers?.item;
  const index = offers?.index;
  const [price, setPrice] = useState('');

  useEffect(() => {
    const getOfferPrice = async () => {
      const offerPrice = await commonApi.get(
        `product-offers/${offer.id}/product-offer-prices`,
      );
      setPrice(offerPrice?.data?.data?.data?.[0]);
    };
    getOfferPrice();
    productOfferDataForAddToCart(offer, price, 0);
  }, [offer]);

  const onPressOffer = () => {
    productOfferDataForAddToCart(offer, price, index);
  };

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPressOffer}>
      <Box mb="s10" flexDirection="row">
        <BouncyCheckbox
          // isChecked={
          //   index === selectedOfferIndex || offer?.attributes?.isDefault
          // }
          isChecked={index === selectedOfferIndex}
          disableBuiltInState={true}
          // isChecked={index === selectedOfferIndex}
          onPress={() => {
            onPressOffer();
          }}
        />
        <Box
          flex={1}
          flexDirection="row"
          marginHorizontal="s4"
          flexShrink={1}
          mb="s8"
          borderWidth={1}
          borderColor="border"
          borderRadius={8}
          padding="s8"
          key={offer?.attributes?.id}>
          <Box paddingLeft="s4" flexDirection="row">
            <Box justifyContent="space-between">
              <Text>{offer?.id}</Text>
              <Text>$ {calculatePrice(price?.attributes?.price)}</Text>
            </Box>
          </Box>
        </Box>
      </Box>
    </TouchableOpacity>
  );
};

export default ProductOffer;
