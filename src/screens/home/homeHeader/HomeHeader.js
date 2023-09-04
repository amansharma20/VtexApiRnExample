/* eslint-disable react-native/no-inline-styles */
import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import FastImage from 'react-native-fast-image';
import {Box} from '@atoms';
import Icons from '../../../assets/constants/Icons';

const HomeHeader = () => {
  return (
    <Box justifyContent="center" alignItems="center">
      <FastImage
        source={Icons.sushittoIcon}
        style={{
          width: 200,
          height: 50,
          alignItems: 'center',
        }}
        resizeMode="contain"
      />
    </Box>
  );
};

export default HomeHeader;

const styles = StyleSheet.create({});
