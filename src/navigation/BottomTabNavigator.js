/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/home/HomeScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import CartScreen from '../screens/cart/CartScreen';
import {HomeIcon} from '../assets/svgs';
import {Image} from 'react-native';
import Icons from '../assets/constants/Icons';
import SushittoHomeScreen from '../screens/sushittoHomeScreen/SushittoHomeScreen';
import {theme} from '../atoms/theme';
import MapScreen from '../screens/location/MapScreen';

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  const Icon = ({source, focused, color}) => {
    return (
      <Image
        source={source}
        style={{
          width: 24,
          height: 24,
          tintColor: focused ? theme.colors.sushiittoRed : color,
        }}
      />
    );
  };

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.sushiittoRed,
      }}>
      <Tab.Screen
        name="Home"
        component={SushittoHomeScreen}
        options={{
          tabBarIcon: ({focused, color}) => {
            return (
              <Icon source={Icons.homeIcon} focused={focused} color={color} />
            );
          },
        }}
      />
      <Tab.Screen
        name="Location"
        component={MapScreen}
        options={{
          tabBarIcon: ({focused, color}) => {
            return (
              <Icon source={Icons.mapIcon} focused={focused} color={color} />
            );
          },
        }}
      />
      {/* <Tab.Screen name="Search" component={SearchScreen} /> */}
      {/* <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          tabBarIcon: ({focused, color}) => (
            <Icon source={Icons.cartIcon} focused={focused} color={color} />
          ),
        }}
      /> */}
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({focused, color}) => (
            <Icon source={Icons.profileIcon} focused={focused} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
