/* eslint-disable react-native/no-inline-styles */
import {SafeAreaView, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import {Box, Text, theme} from '@atoms';
import GoBackButton from '../GoBackButton/GoBackButton';
import {CartIcon} from '../../assets/svgs';
import {useGoToCart} from '../../hooks/useGoToCart';
// import GoBackButton from './GoBackButton/GoBackButton';
import {useIsUserLoggedIn} from '../../hooks/useIsUserLoggedIn';
import {useGuestCartItemsCount} from '../../hooks/useGuestCartItemsCount';
import {useCartItemsCount} from '../../hooks/useCartItemsCount';
import {useNavigation} from '@react-navigation/native';

const CommonHeader = ({title, onPress, showCartIcon = false, ...props}) => {
  const navigation = useNavigation();
  const {goToCart} = useGoToCart();
  const {isUserLoggedIn} = useIsUserLoggedIn();

  const {cartItemsCount} = useCartItemsCount();

  const onPressCart = () => {
    // goToCart();
    navigation.navigate('CartScreen');
  };

  return (
    <Box flexDirection="row">
      <SafeAreaView style={styles.container} {...props}>
        <Box flexDirection="row" alignItems="center" maxWidth={'80%'}>
          <GoBackButton onPress={onPress} />
          <Text variant="bold18" style={{maxWidth: '90%'}} numberOfLines={1}>
            {title}
          </Text>
        </Box>
        {showCartIcon && (
          <>
            <TouchableOpacity
              style={styles.cartContainer}
              onPress={onPressCart}>
              {cartItemsCount !== null ? (
                <>
                  <Box
                    style={{
                      backgroundColor: '#F50157',
                      zIndex: 2,
                      position: 'absolute',
                      alignItems: 'center',
                      width: 16,
                      height: 16,
                      justifyContent: 'center',
                      flexDirection: 'row',
                      borderRadius: 100,
                      marginLeft: 16,
                    }}>
                    <Text
                      fontSize={12}
                      // fontWeight="700"
                      variant="bold18"
                      ml="s2">
                      {cartItemsCount ?? 0}
                    </Text>
                  </Box>
                </>
              ) : (
                <></>
              )}
              <CartIcon />
            </TouchableOpacity>
          </>
        )}
      </SafeAreaView>
    </Box>
  );
};

export default CommonHeader;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: theme.spacing.paddingHorizontal,
    marginBottom: theme.spacing.s8,
    justifyContent: 'space-between',
    flexShrink: 1,
    width: '100%',
  },
  cartContainer: {
    padding: 6,
  },
});
