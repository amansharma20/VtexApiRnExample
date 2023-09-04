import {Theme} from '@atoms';
import {useTheme} from '@shopify/restyle';
import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import Text from './text';

interface GradientButtonProp {
  disabledStyle?: {colors?: string[]};
  children?: React.ReactNode;
  style?: ViewStyle[] | ViewStyle;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  outline?: boolean;
  title?: string;
  textColor?: string;
  textStyle?: TextStyle;
  colors?: string[];
  angle?: number;
}
const GradientButton = (props: GradientButtonProp) => {
  const theme = useTheme<Theme>();
  const {
    title = '',
    children,
    disabled = false,
    style = [],
    disabledStyle = {},
    onPress = null,
    outline = false,
    loading = false,
    textColor = theme.colors.background,
    textStyle = [],
    colors = ['#023373', '#023373'],
    angle = 255,
  } = props;
  const {
    colors: disabledColors = [
      theme.colors.shadowLight,
      theme.colors.shadowLight,
    ],
  } = disabledStyle;
  const activeColorProp = disabled ? disabledColors : colors;
  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={() => {
        if (onPress && !loading) {
          onPress();
        }
      }}>
      <LinearGradient
        colors={activeColorProp}
        angle={angle}
        useAngle
        style={[styles.btn, style]}>
        {loading ? (
          <ActivityIndicator
            color={outline ? theme.colors.primary : theme.colors.background}
            size="small"
          />
        ) : (
          children ?? (
            <Text
              variant="normal"
              fontSize={16}
              fontWeight="700"
              style={[{color: textColor}, textStyle]}
              >
              {title}
            </Text>
          )
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  btn: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
});

export default GradientButton;
