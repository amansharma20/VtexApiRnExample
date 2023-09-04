/* eslint-disable react-hooks/exhaustive-deps */
// import * as React from 'react';
import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';
import React, {useEffect, useMemo, useReducer, useRef, useState} from 'react';
import ProductDetailsScreen from '../screens/product/ProductDetailsScreen';
import BottomTabNavigator from './BottomTabNavigator';
import ProductsListScreen from '../screens/product/ProductsListScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RNRestart from 'react-native-restart';
import * as Keychain from 'react-native-keychain';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PersonalDetailsScreen from '../screens/profile/PersonalDetailsScreen';
import {Alert, AppState} from 'react-native';
import jwt_decode from 'jwt-decode';
import CheckoutScreen from '../screens/checkout/CheckoutScreen';
import YourOrdersScreen from '../screens/orders/YourOrdersScreen';
import OrderDetailsScreen from '../screens/orders/OrderDetailsScreen';
import CartScreen from '../screens/cart/CartScreen';
import SearchScreen from '../screens/search/SearchScreen';
import {useDispatch, useSelector} from 'react-redux';
import {CustomerCartIdApiAsyncThunk} from '../redux/customerCartIdApi/CustomerCartIdApiAsyncThunk';
import BundledProductsListScreen from '../screens/product/BundledProductsListScreen';
import BundleProductDetailsScreen from '../screens/product/BundleProductDetailsScreen';
import WishlistScreen from '../screens/wishlist/WishlistScreen';
import WishlistItemsScreen from '../screens/wishlist/WishlistItemsScreen';
import {getCustomerWishlist} from '../redux/wishlist/GetWishlistApiAsyncThunk';
import SushittoHomeScreen from '../screens/sushittoHomeScreen/SushittoHomeScreen';
import BundlesScreen from '../screens/bundles/BundlesScreen';
import ConfiguredBundleScreen from '../screens/configuredBundle/ConfiguredBundleScreen';
import ConfigurableBundleSlotsScreen from '../screens/configuredBundle/ConfigurableBundleSlotsScreen';
import BundlesSummaryScreen from '../screens/bundles/BundlesSummaryScreen';
import {getProductsByWishlistAsyncThunk} from '../redux/wishlist/ProductsWishlistApiAsyncThunk';
import BundlesScreenNew from '../screens/bundles/BundlesScreenNew';
import GuestCartScreen from '../screens/guestCart/GuestCartScreen';
import AddAddressScreen from '../screens/address/AddAddressScreen';
import MapScreen from '../screens/location/MapScreen';
import {theme} from '../atoms/theme';

export const AuthContext = React.createContext();

const Stack = createStackNavigator();

export default function StackNavigator() {
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  const reduxDispatch = useDispatch();

  const customerWishlistFirstId = useSelector(
    state =>
      state?.getWishlistApiSlice?.customerWishlistData?.data?.data?.[0]?.id ||
      [],
  );

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      // if (
      //   appState.current.match(/inactive|background/) &&
      //   nextAppState === 'active'
      // ) {
      // }

      appState.current = nextAppState;
      setAppStateVisible(appState.current);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    const getTokenExpiry = async () => {
      const token = await AsyncStorage.getItem('tokenExpiry');
      if (token) {
        var decoded = jwt_decode(token);
        var tokenExpiryDate = new Date(0);
        tokenExpiryDate.setUTCSeconds(decoded.exp);
        var currentDate = new Date();

        var remainingTime = tokenExpiryDate.getTime() - currentDate.getTime();
        if (remainingTime / 1000 <= 0) {
          Alert.alert(
            'Your session has expired.\n',
            'Please login again to continue.',
            [
              {
                text: 'Ok',
                onPress: () => {},
                style: 'destructive',
              },
            ],
          );
          authContext.signOut();
        }
      }
    };
    getTokenExpiry();
  }, [appStateVisible, authContext]);

  const [state, dispatch] = useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
    },
  );

  const authContext = useMemo(
    () => ({
      signIn: async data => {
        await Keychain.setGenericPassword('email', data);
        dispatch({type: 'SIGN_IN', token: data});
      },
      signOut: async () => {
        await Keychain.resetGenericPassword();
        AsyncStorage.removeItem('tokenExpiry');
        RNRestart.Restart();
        dispatch({type: 'SIGN_OUT'});
      },
      state: state,
    }),
    [state],
  );

  useEffect(() => {
    const bootstrapAsync = async () => {
      let userToken;

      try {
        userToken = await Keychain.getGenericPassword();
      } catch (e) {}

      userToken === false
        ? dispatch({type: 'RESTORE_TOKEN', token: null})
        : dispatch({type: 'RESTORE_TOKEN', token: userToken});
    };

    bootstrapAsync();
  }, []);

  useEffect(() => {
    if (state.userToken) {
      reduxDispatch(CustomerCartIdApiAsyncThunk('carts')).then(res => {
        if (res.payload?.status === 401) {
          authContext.signOut();
        }
        console.log('carts api call successful');
      });
      reduxDispatch(getCustomerWishlist('shopping-lists'));
      reduxDispatch(
        getProductsByWishlistAsyncThunk(
          `shopping-lists/${customerWishlistFirstId}?include=shopping-list-items%2Cconcrete-products%2Cconcrete-product-image-sets%2Cconcrete-product-prices`,
        ),
      );
    }
  }, [state.userToken]);

  return (
    <AuthContext.Provider value={authContext}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          // cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          keyboardHidesTabBar: true,
        }}>
        <Stack.Screen
          name="BottomTabNavigator"
          component={BottomTabNavigator}
        />
        {state.userToken == null ? (
          <>
            <Stack.Screen
              name="LoginScreen"
              component={LoginScreen}
              options={{
                cardStyleInterpolator:
                  CardStyleInterpolators.forModalPresentationIOS,
                headerShown: false,
                headerShadowVisible: false,
                presentation: 'modal',
              }}
            />
          </>
        ) : (
          <></>
        )}
        <Stack.Screen
          name="ProductDetailsScreen"
          component={ProductDetailsScreen}
        />
        <Stack.Screen
          name="ProductsListScreen"
          component={ProductsListScreen}
        />
        <Stack.Screen
          name="PersonalDetailsScreen"
          component={PersonalDetailsScreen}
        />
        <Stack.Screen name="CheckoutScreen" component={CheckoutScreen} />
        <Stack.Screen name="YourOrdersScreen" component={YourOrdersScreen} />
        <Stack.Screen
          name="OrderDetailsScreen"
          component={OrderDetailsScreen}
        />
        <Stack.Screen name="CartScreen" component={CartScreen} />
        <Stack.Screen
          name="SearchScreen"
          component={SearchScreen}
          options={{
            cardStyleInterpolator:
              CardStyleInterpolators.forModalPresentationIOS,
            headerShown: false,
            headerShadowVisible: false,
            presentation: 'modal',
          }}
        />
        <Stack.Screen
          name="BundledProductsListScreen"
          component={BundledProductsListScreen}
        />
        <Stack.Screen
          name="BundleProductDetailsScreen"
          component={BundleProductDetailsScreen}
        />
        <Stack.Screen name="WishlistScreen" component={WishlistScreen} />
        <Stack.Screen
          name="WishlistItemsScreen"
          component={WishlistItemsScreen}
        />
        <Stack.Screen
          name="SushittoHomeScreen"
          component={SushittoHomeScreen}
        />
        <Stack.Screen name="BundlesScreen" component={BundlesScreen} />
        <Stack.Screen name="BundlesScreenNew" component={BundlesScreenNew} />
        <Stack.Screen
          name="ConfiguredBundleScreen"
          component={ConfiguredBundleScreen}
        />
        <Stack.Screen
          name="ConfigurableBundleSlotsScreen"
          component={ConfigurableBundleSlotsScreen}
        />
        <Stack.Screen
          name="BundlesSummaryScreen"
          component={BundlesSummaryScreen}
        />
        <Stack.Screen name="GuestCartScreen" component={GuestCartScreen} />
        <Stack.Screen name="AddAddressScreen" component={AddAddressScreen} />
        <Stack.Screen
          name="MapScreen"
          component={MapScreen}
          options={{
            cardStyleInterpolator:
              CardStyleInterpolators.forModalPresentationIOS,
            headerShown: true,
            headerShadowVisible: true,
            presentation: 'modal',
            headerTitle: 'Choose pickup restaurant',
            headerTitleStyle: theme.textVariants.bold18,
          }}
        />
      </Stack.Navigator>
    </AuthContext.Provider>
  );
}
