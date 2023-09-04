/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import {Animated, Image, StyleSheet, TouchableOpacity} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {Box, Text} from '@atoms';
import {SCREEN_WIDTH} from '@gorhom/bottom-sheet';
import {useCartItemsCount} from '../../../hooks/useCartItemsCount';
import {useSelector} from 'react-redux';
import Icons from '../../../assets/constants/Icons';
import {useNavigation} from '@react-navigation/native';
import {calculatePrice} from '../../../utils/CommonFunctions';

const HomeCartPopUp = () => {
  const navigation = useNavigation();
  const {cartItemsCount} = useCartItemsCount();

  const [isVisible, setIsVisible] = useState(false);

  const customerCartDataNew = useSelector(
    state => state.getCartDataNewApiSlice?.cartDataNew.data,
  );

  const guestCartGrandTotal = useSelector(
    state =>
      state.getGuestCartDataApiSlice?.itemTotal?.[0]?.attributes?.totals
        ?.grandTotal || null,
  );

  const grandTotal =
    customerCartDataNew?.attributes?.totals?.grandTotal || guestCartGrandTotal;

  const slideAnimation = useRef(new Animated.Value(0)).current;

  const hideComponentWithAnimation = () => {
    Animated.timing(slideAnimation, {
      toValue: 500, // Replace with the height of the component you want to slide out
      duration: 500, // Adjust the duration as desired
      useNativeDriver: true,
    }).start();
  };

  const showComponentWithAnimation = () => {
    Animated.timing(slideAnimation, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    if (cartItemsCount > 0) {
      if (!isVisible) {
        showComponentWithAnimation();
        setIsVisible(true);
      }
    } else {
      hideComponentWithAnimation();
      setIsVisible(false);
    }
  }, [cartItemsCount]);

  return (
    <Animated.View
      style={{
        transform: [{translateY: slideAnimation}],
        // position: 'absolute',
        zIndex: 100,
      }}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => {
          navigation.navigate('CartScreen');
        }}>
        <Box
          height={42}
          backgroundColor="sushiittoRed"
          position="absolute"
          bottom={16}
          flex={1}
          width={SCREEN_WIDTH - 32}
          alignSelf="center"
          flexGrow={1}
          padding="s4"
          paddingHorizontal="s12"
          alignItems="center"
          justifyContent="center"
          borderRadius={8}>
          <Box
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
            width={'100%'}>
            <Text color="white" variant="bold18" fontSize={16}>
              View cart
            </Text>
            <Box
              flexDirection="row"
              alignItems="center"
              backgroundColor="darkRed"
              paddingHorizontal="s14"
              borderRadius={100}
              paddingVertical="s2">
              <Box
                height={24}
                alignItems="center"
                justifyContent="center"
                mt="s2">
                <Text color="white" variant="bold18">
                  {cartItemsCount} · ${calculatePrice(grandTotal)}
                </Text>
              </Box>
              <Image
                source={Icons.cartIconSolid}
                style={{
                  width: 18,
                  height: 18,
                  resizeMode: 'contain',
                  tintColor: 'white',
                  marginLeft: 2,
                }}
              />
            </Box>
          </Box>
        </Box>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default HomeCartPopUp;

const styles = StyleSheet.create({});
