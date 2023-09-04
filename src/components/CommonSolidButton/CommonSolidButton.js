import {StyleSheet, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {theme, Text} from '@atoms';

const CommonSolidButton = ({
  title,
  onPress,
  disabledOnPress,
  style,
  disabled,
  ...rest
}) => {
  if (disabled) {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={[styles.disabledContainer, style]}
        onPress={disabledOnPress}>
        <Text
          variant="bold14"
          color="greyText"
          marginHorizontal="s8"
          alignSelf="center">
          {title}
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[styles.container, style]}
      onPress={onPress}
      {...rest}>
      <Text
        variant="bold14"
        color="white"
        marginHorizontal="s8"
        alignSelf="center">
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default CommonSolidButton;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 40,
    backgroundColor: theme.colors.zomatoRed,
    borderRadius: theme.spacing.lml,
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
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
