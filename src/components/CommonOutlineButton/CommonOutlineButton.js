import {StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import {Box, Text, theme} from '@atoms';
import {CopyContentIcon} from '../../assets/svgs';

const CommonOutlineButton = ({
  title,
  onPress,
  style,
  icon = false,
  borderRadius = 30,
  height = 40,
  backgroundColor,
  disabled,
  disabledOnPress,
}) => {
  if (icon) {
    return (
      <TouchableOpacity disabled style={{...style}} onPress={onPress}>
        <Box
          backgroundColor="white"
          alignItems="center"
          justifyContent="center"
          borderRadius={borderRadius}
          height={height}
          borderColor="green"
          borderWidth={1}
          width={'100%'}
          flexDirection="row">
          <Text
            variant="bold14"
            color="green"
            marginHorizontal="s8"
            alignSelf="center">
            {title}
          </Text>
          <CopyContentIcon />
        </Box>
      </TouchableOpacity>
    );
  }

  if (disabled) {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={[styles.disabledContainer, style]}
        onPress={disabledOnPress}>
        <Text
          variant="bold14"
          color="white"
          marginHorizontal="s8"
          alignSelf="center">
          {title}
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={{...style}} onPress={onPress}>
      <Box
        backgroundColor={backgroundColor ? backgroundColor : 'white'}
        alignItems="center"
        justifyContent="center"
        borderRadius={30}
        height={height}
        borderColor="sushiittoRed"
        borderWidth={1}
        width={'100%'}
        // style={{ ...style }}
      >
        <Text
          variant="bold14"
          color="sushiittoRed"
          marginHorizontal="s8"
          alignSelf="center">
          {title}
        </Text>
      </Box>
    </TouchableOpacity>
  );
};

export default CommonOutlineButton;

const styles = StyleSheet.create({
  disabledContainer: {
    width: '100%',
    height: 40,
    backgroundColor: theme.colors.disabled,
    borderRadius: theme.spacing.lml,
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
  },
});
