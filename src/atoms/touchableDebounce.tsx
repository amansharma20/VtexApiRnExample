import { Theme } from '@atoms';
import { useTheme } from '@shopify/restyle';
import { debounce } from 'lodash';
import React, { Fragment, memo } from 'react';
import { TouchableOpacity, ViewStyle } from 'react-native';

interface TouchableOpacityProps {
  onPress: () => void;
  onLongPress?: () => void;
  delayLongPress?: number | undefined;
  children: React.ReactNode;
  i?: string | number;
  h?: number | string;
  w?: number | string;
  e?: number;
  ao?: number;
  bg?: string;
  style?: ViewStyle;
  br?: number;
  bc?: string;
  disabled?: boolean;
  jc?: string;
}

export default memo((props: TouchableOpacityProps) => {
  const theme = useTheme<Theme>();

  const {
    onPress,
    onLongPress,
    delayLongPress,
    i = '0',
    children,
    ao = 0.2,
    disabled = false,
    h,
    w,
    bg = theme.backgroundColor,
    br = 0,
    bc = theme.backgroundColor,
    style = {},
  } = props;

  return (
    <TouchableOpacity
      key={i}
      activeOpacity={ao}
      disabled={disabled}
      onLongPress={onLongPress}
      onPress={debounce(() => {
        onPress();
      }, 1000)}
      delayLongPress={delayLongPress}
      style={[
        {
          height: h,
          width: w,
          backgroundColor: bg,
          borderRadius: br,
          borderColor: bc,
        },
        style,
      ]}>
      <Fragment>{children}</Fragment>
    </TouchableOpacity>
  );
});
