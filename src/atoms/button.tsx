import * as React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from "react-native";

import Text from "./text";
import { theme } from "./theme";

interface ButtonProps extends ViewStyle {
  children?: React.ReactNode;
  style?: ViewStyle[];
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  outline?: boolean;
  title?: string;
  textColor?: string;
  loaderColor?: string;
  textStyle?: TextStyle[];
  variant?: string;
}

const Button = (props: ButtonProps) => {
  const {
    title = "",
    children,
    disabled = false,
    style = [],
    onPress = null,
    outline = false,
    loaderColor,
    loading = false,
    textStyle = {},
    textColor = outline ? "black" : "white",
    variant = "normal",
    ...viewStyle
  } = props;
  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={() => {
        if (onPress && !loading) {
          onPress();
        }
      }}
      style={[
        outline ? styles.btnOutline : styles.btn,
        ...style,
        { ...viewStyle },
        disabled && styles.disabled,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          color={
            loaderColor ??
            (outline ? theme.colors.primary : theme.colors.background)
          }
          size="small"
        />
      ) : (
        children ?? (
          <Text variant={variant} style={[{ color: textColor }, textStyle]}>
            {title}
          </Text>
        )
      )}
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  btn: {
    height: 45,
    backgroundColor: theme.colors.primary,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },
  btnOutline: {
    height: 45,
    paddingHorizontal: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    backgroundColor: "transparent",
    borderColor: theme.colors.orangeDark,
    borderRadius: 5,
  },
  disabled: {
    backgroundColor: theme.colors.disabledGray,
  },
});
export default Button;
