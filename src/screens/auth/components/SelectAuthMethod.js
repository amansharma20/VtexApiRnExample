/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {Image, StyleSheet, TouchableOpacity} from 'react-native';
import {Box, Text, theme} from '@atoms';
import Icons from '../../../assets/constants/Icons';

const SelectAuthMethod = ({selectedOption, setSelectedOption}) => {
  const IS_LOGIN = selectedOption === 'login';
  const IS_SING_UP = selectedOption === 'signup';

  const handleOptionChange = option => {
    setSelectedOption(option);
  };

  return (
    <Box
      // flex={1}
      justifyContent="center"
      alignItems="center"
      paddingVertical="s16"
      paddingHorizontal="s16">
      <Box
        flexDirection="row"
        alignItems="center"
        backgroundColor="snowy"
        borderRadius={100}>
        <TouchableOpacity
          onPress={() => handleOptionChange('login')}
          style={[styles.tabButton, IS_LOGIN && styles.selectedTabButton]}>
          <Box flexDirection="row" alignItems="center">
            {/* <Image
              source={Icons.deliveryIcon}
              style={[
                styles.icon,
                IS_LOGIN && {tintColor: theme.colors.sushiittoRed},
              ]}
              resizeMode="contain"
            /> */}
            <Text style={[styles.tabText, IS_LOGIN && styles.selectedTabText]}>
              LOGIN
            </Text>
          </Box>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleOptionChange('signup')}
          style={[styles.tabButton, IS_SING_UP && styles.selectedTabButton]}>
          <Box flexDirection="row" alignItems="center">
            {/* <Image
              source={Icons.pickUpIcon}
              style={[
                styles.icon,
                IS_SING_UP && {tintColor: theme.colors.sushiittoRed},
              ]}
              resizeMode="contain"
            /> */}
            <Text
              style={[styles.tabText, IS_SING_UP && styles.selectedTabText]}>
              SIGN UP
            </Text>
          </Box>
        </TouchableOpacity>
      </Box>
    </Box>
  );
};

const styles = StyleSheet.create({
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  selectedTabButton: {
    backgroundColor: theme.colors.veryLightRed,
    borderRadius: 100,
    borderColor: theme.colors.sushiittoRed,
    borderWidth: 1,
  },
  tabText: {
    color: 'black',
    fontSize: 14,
    fontWeight: '600',
  },
  selectedTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.sushiittoRed,
  },
  icon: {
    width: 20,
    height: 20,
    tintColor: theme.colors.black,
    marginRight: 4,
  },
});

export default SelectAuthMethod;
