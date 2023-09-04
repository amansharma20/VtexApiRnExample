/* eslint-disable react-hooks/exhaustive-deps */
import {useCallback, useContext} from 'react';
import {AuthContext} from '../navigation/StackNavigator';
import {useNavigation} from '@react-navigation/native';

export const useGoToCart = () => {
  const navigation = useNavigation();
  const {state} = useContext(AuthContext);
  const isUserLoggedIn = state.userToken ? true : false;
  const goToCart = useCallback(() => {
    if (isUserLoggedIn) {
      navigation.navigate('CartScreen');
    } else {
      navigation.navigate('LoginScreen');
    }
  }, [isUserLoggedIn]);

  return {goToCart};
};
