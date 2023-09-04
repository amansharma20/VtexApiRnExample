import {StyleSheet} from 'react-native';
import React from 'react';
import {Box, Text} from '@atoms';
import FastImage from 'react-native-fast-image';
import Images from '../assets/constants/Images';

const PoweredBySpryker = () => {
  return (
    <Box alignItems="center">
      <Text>Powered by</Text>
      <FastImage
        source={Images.sprykerLogo}
        style={styles.sprykerLogo}
        resizeMode="cover"
      />
    </Box>
  );
};

export default PoweredBySpryker;

const styles = StyleSheet.create({
  sprykerLogo: {
    height: 50,
    alignItems: 'center',
    width: 180,
  },
});
