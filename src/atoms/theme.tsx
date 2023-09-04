import {createTheme} from '@shopify/restyle';
import {Platform} from 'react-native';

const globalPallete = {};

export const FONT = {
  PrimaryExtraLight: 'Metropolis-ExtraLight', // 200
  PrimaryLight: 'Metropolis-Light', // 300
  Primary: 'Metropolis-Regular', // 400
  PrimarySemiBold: 'Metropolis-SemiBold', // 600
  PrimaryBold: 'Metropolis-Bold', // 700
  PrimaryHeavy: 'Metropolis-Black', // 900
};

export const theme = createTheme({
  backgroundColor: '#ffffff',
  colors: {
    background: '#ffffff',
    white: '#FFFFFF',
    darkText: '#00313A',
    lightText: '#272727',
    lightGreyText: '#33404F',
    greyText: '#9AADC7',
    darkBlueText: '#023373',
    black: '#000000',
    borderGrey: '#DADADA',
    lightBlack: '#333333',
    blue: '#BFE3FF',
    lightGrey: '#999999',
    border: '#E6E6E6',
    disabled: '#E6E6E6',
    grey: '#7C7C7C',
    inputGrey: '#F5F5F5',
    purple: '#6650A4',
    red: 'red',
    green: '#006400',
    bottomTabActiveColor: '#4486c6',
    lightGreen: '#1BB18B',
    inactiveDot: '#CACACA',
    activeDot: '#505050',
    transparent: 'transparent',
    sushiittoRed: '#E40047',
    // sushiittoRed: '#F50145',
    // zomatoRed: '#ED5469',
    zomatoRed: '#E40047',
    veryLightRed: '#F7F1F3',
    darkRed: '#83042A',
    snowy: '#F9F9F9',
    lightBlueBg: '#E8F5FF',
    ...globalPallete,
  },
  spacing: {
    xxs: 2,
    xs: 6,
    s: 8,
    sm: 12,
    m: 16,
    ml: 20,
    l: 24,
    lm: 28,
    lml: 30,
    lx: 34,
    l2: 32,
    l3: 36,
    l4: 48,
    xl: 40,
    xxl: 54,
    // new
    s0: 0,
    s2: 2,
    s4: 4,
    s3: 3,
    s6: 6,
    s7: 7,
    s8: 8,
    s10: 10,
    backButtonPadding: 10,
    s12: 10,
    s14: 14,
    s16: 16,
    s18: 18,
    s20: 20,
    s24: 24,
    s28: 28,
    s30: 30,
    s32: 32,
    s34: 34,
    s36: 36,
    s38: 38,
    s48: 48,
    s40: 40,
    s54: 54,
    s75: 75,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  breakpoints: {},
  textVariants: {
    // new
    regular10: {
      fontSize: 10,
      fontFamily: FONT.Primary,
      color: 'darkText',
    },
    regular10Lightblack: {
      fontSize: 10,
      fontFamily: FONT.Primary,
      color: 'lightBlack',
    },
    regular12Lightblack: {
      fontSize: 12,
      fontFamily: FONT.Primary,
      color: 'lightBlack',
    },
    regular12: {
      fontSize: 12,
      fontFamily: FONT.Primary,
      color: 'darkText',
    },
    regular12LightBlack: {
      fontSize: 12,
      fontFamily: FONT.Primary,
      color: 'lightBlack',
    },
    regular12Grey: {
      fontSize: 12,
      fontFamily: FONT.Primary,
      color: 'grey',
    },
    regular14: {
      fontSize: 14,
      fontFamily: FONT.Primary,
      color: 'darkText',
    },
    regular14LightBlack: {
      fontSize: 14,
      fontFamily: FONT.Primary,
      color: 'lightBlack',
    },
    regular14LightGrey: {
      fontSize: 14,
      fontFamily: FONT.Primary,
      color: 'lightGrey',
    },
    regular16: {
      fontSize: 16,
      fontFamily: FONT.Primary,
      color: 'darkText',
    },
    regular16LightBlack: {
      fontSize: 16,
      fontFamily: FONT.Primary,
      color: 'lightBlack',
    },
    regular18: {
      fontSize: 18,
      fontFamily: FONT.Primary,
      color: 'darkText',
    },
    semiBold9: {
      fontSize: 9,
      fontFamily: FONT.PrimarySemiBold,
      color: 'darkBlueText',
    },
    semiBold12: {
      fontSize: 12,
      fontFamily: FONT.PrimarySemiBold,
      color: 'darkBlueText',
    },
    bottomTabText: {
      fontSize: 10,
      fontFamily: FONT.PrimarySemiBold,
      color: 'darkBlueText',
    },
    semiBold12DarkText: {
      fontSize: 12,
      fontFamily: FONT.PrimarySemiBold,
      color: 'darkText',
    },
    semiBold12LightBlack: {
      fontSize: 12,
      fontFamily: FONT.PrimarySemiBold,
      color: 'lightBlack',
    },
    semiBold10: {
      fontSize: 10,
      fontFamily: FONT.PrimarySemiBold,
      color: 'darkBlueText',
    },
    semiBold16: {
      fontSize: 16,
      fontFamily: FONT.PrimarySemiBold,
      color: 'darkBlueText',
    },
    semiBold18: {
      fontSize: 18,
      fontFamily: FONT.PrimarySemiBold,
      color: 'darkBlueText',
    },
    semiBold24: {
      fontSize: 24,
      fontFamily: FONT.PrimarySemiBold,
      color: 'darkBlueText',
    },
    semiBold14: {
      fontSize: 14,
      fontFamily: FONT.PrimarySemiBold,
      color: 'darkBlueText',
    },
    semiBold14Green: {
      fontSize: 14,
      fontFamily: FONT.PrimarySemiBold,
      color: 'green',
    },
    bold8: {
      fontSize: 8,
      fontFamily: FONT.PrimaryBold,
      color: 'darkText',
    },
    bold10: {
      fontSize: 10,
      fontFamily: FONT.PrimaryBold,
      color: 'darkText',
    },
    bold12: {
      fontSize: 12,
      fontFamily: FONT.PrimaryBold,
      color: 'darkText',
    },
    bold14: {
      fontSize: 14,
      fontFamily: FONT.PrimaryBold,
      color: 'darkText',
    },
    bold20: {
      fontSize: 20,
      fontFamily: FONT.PrimaryBold,
      color: 'darkText',
    },
    bold20DarkBlue: {
      fontSize: 20,
      fontFamily: FONT.PrimaryBold,
      color: 'darkBlueText',
    },
    bold24: {
      fontSize: 24,
      fontFamily: FONT.PrimaryBold,
      color: 'darkText',
      fontWeight: '700',
    },
    bold14LightBlack: {
      fontSize: 14,
      fontFamily: FONT.PrimaryBold,
      color: 'lightBlack',
    },
    semiBold14LightBlack: {
      fontSize: 14,
      fontFamily: FONT.PrimaryBold,
      color: 'lightBlack',
    },
    bold14Green: {
      fontSize: 14,
      fontFamily: FONT.PrimaryBold,
      color: 'green',
    },
    bold16: {
      fontSize: 16,
      fontFamily: FONT.PrimaryBold,
      color: 'darkText',
    },
    bold16Green: {
      fontSize: 16,
      fontFamily: FONT.PrimaryBold,
      color: 'green',
    },
    bold16DarkBlue: {
      fontSize: 16,
      fontFamily: FONT.PrimaryBold,
      color: 'darkBlueText',
    },
    bold16LightBlack: {
      fontSize: 16,
      fontFamily: FONT.PrimaryBold,
      color: 'darkText',
    },
    bold18: {
      fontSize: 18,
      fontFamily: FONT.PrimaryBold,
      color: 'darkText',
      // fontWeight: '700',
    },
    bold18LightBlack: {
      fontSize: 18,
      fontFamily: FONT.PrimaryBold,
      color: 'lightBlack',
    },
    darkBlueBold18: {
      fontSize: 18,
      fontFamily: FONT.PrimaryBold,
      color: 'darkBlueText',
    },
    bold22: {
      fontSize: 22,
      fontFamily: FONT.PrimaryBold,
      color: 'darkText',
    },
    bold28: {
      fontSize: 28,
      fontFamily: FONT.PrimaryBold,
      color: 'darkText',
    },
    bold40: {
      fontSize: 40,
      fontFamily: FONT.PrimaryBold,
      color: 'darkText',
    },
    bold32: {
      fontSize: 32,
      fontFamily: FONT.PrimaryBold,
      color: 'darkText',
    },
    bold36: {
      fontSize: 36,
      fontFamily: FONT.PrimaryBold,
      color: 'darkText',
    },
    normal: {
      fontSize: 14,
      fontFamily: FONT.Primary,
      color: 'black',
    },
    onBoardingText: {
      fontSize: 32,
      // fontFamily: FONT.PrimaryBold,
      color: 'darkText',
      textAlign: 'center',
      paddingTop: 's40',
      lineHeight: 34,
    },
  },
  cardVariants: {
    default: {
      shadowOpacity: 0.2,
      backgroundColor: 'background',
      shadowColor: 'shadowLight',
      shadowOffset: {width: 0, height: 0},
      shadowRadius: 8,
      borderRadius: 6,
      elevation: 5,
    },
    light: {
      shadowOpacity: 0.1,
      backgroundColor: 'background',
      shadowColor: 'shadowLight',
      shadowOffset: {width: 0, height: 0},
      shadowRadius: 2,
      borderRadius: 3,
      elevation: 2,
    },
    dark: {
      shadowOpacity: 0.5,
      backgroundColor: 'background',
      shadowColor: 'shadowLight',
      shadowOffset: {width: 2, height: 2},
      shadowRadius: 5,
      borderRadius: 6,
      elevation: 2,
    },
    optimizedDark: {
      shadowOpacity: 0.5,
      backgroundColor: 'white',
      shadowColor: Platform.select({
        android: 'black',
        ios: 'black',
      }),
      shadowOffset: {width: 2, height: 2},
      shadowRadius: 5,
      // borderRadius: 6,
      elevation: 20,
    },
    optimizedLight: {
      shadowOpacity: 0.04,
      shadowColor: Platform.select({
        android: 'black',
        ios: 'black',
      }),
      shadowOffset: {width: 0, height: 4},
      shadowRadius: 4,
      // borderRadius: 8,
      elevation: 10,
    },
    optimizedLightBlue: {
      shadowOpacity: 1,
      backgroundColor: 'background',
      shadowColor: Platform.select({
        android: 'primaryDark',
        ios: 'blueLightBackground',
      }),
      shadowOffset: {width: 0, height: 8},
      shadowRadius: 20,
      borderRadius: 10,
      elevation: 20,
    },
    whiteWithBorder: {
      borderColor: 'border',
      borderWidth: 1,
      borderRadius: 8,
      padding: 's16',
    },
    bottomButtonShadow: {
      shadowOpacity: 0.05,
      shadowRadius: 10,
      elevation: 20,
      shadowOffset: {width: 0, height: -10},
    },
  },
  // fontFamily: FONT,
});

export type Theme = typeof theme;

export const lightTheme: Theme = {
  ...theme,
};
