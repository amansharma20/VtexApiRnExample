import React, {useCallback, useContext, useRef, useState} from 'react';
import {Box, FONT, Text, theme} from '@atoms';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import {commonApi} from '../../api/CommanAPI';
import * as Keychain from 'react-native-keychain';
import {AuthContext} from '../../navigation/StackNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import CommonSolidButton from '../../components/CommonSolidButton/CommonSolidButton';
import HomeHeader from '../home/homeHeader/HomeHeader';
import PoweredBySpryker from '../../components/PoweredBySpryker';
import {CrossIcon} from '../../assets/svgs';
import CommonOutlineButton from '../../components/CommonOutlineButton/CommonOutlineButton';
import {useIsUserLoggedIn} from '../../hooks/useIsUserLoggedIn';
import DynamicSnapPointBottomSheet from '../../components/bottomsheets/DynamicSnapPointBottomSheet';
import SignUpScreen from './SignUpScreen';
import SelectAuthMethod from './components/SelectAuthMethod';
import {useDispatch} from 'react-redux';
import {getCustomerDetails} from '../../redux/profileApi/ProfileApiAsyncThunk';
import {Toast} from 'react-native-toast-message/lib/src/Toast';
import CommonLoading from '../../components/CommonLoading';
import {createCustomerCart} from '../../redux/createCustomerCart/CreateCustomerCartApiAsyncThunk';
import axios from 'axios';
import {applicationProperties} from '../../utils/application.properties';

export default function LoginScreen(props) {
  const dispatch = useDispatch();
  const {signIn} = useContext(AuthContext);
  const redirectToScreen = props?.route?.params?.redirectToScreen;
  const hideGuestUserCta = props?.route?.params?.hideGuestUserCta || false;
  const {isUserLoggedIn} = useIsUserLoggedIn();

  const navigation = useNavigation();

  // SELECTED AUTH METHOD

  const [selectedOption, setSelectedOption] = useState('login');

  const [userEmail, setUserEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  function isValidEmail(email) {
    // Regular expression for email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  }

  const getButtonStatus = () => {
    if (isValidEmail(userEmail) === false || password.length === 0) {
      return true;
    } else {
      return false;
    }
  };

  const onPressLogin = async () => {
    console.log('here');
    setIsLoading(true);
    CommonLoading.show();
    const apiData = {
      grant_type: 'password',
      username: userEmail,
      password: password,
      client_id: 'frontend',
      client_secret: applicationProperties.client_secret,
    };
    const response = await commonApi.post('token', apiData, {
      'Content-Type': 'multipart/form-data',
    });
    if (response.data?.status === 200) {
      await AsyncStorage.setItem(
        'tokenExpiry',
        // response?.data?.data.expires_in.toString(),
        response?.data?.data.access_token,
      );
      var token = 'Bearer ' + response?.data?.data?.access_token;
      // var token = 'Bearer ' + response?.data?.data?.refresh_token;
      signIn(token);
      dispatch(getCustomerDetails('customers')).then(res => {
        console.log(
          'response.data?.data?.attributes?.firstName: ',
          res.payload?.data?.data?.[0]?.attributes?.firstName,
        );
        CommonLoading.hide();
        Toast.show({
          type: 'success',
          text1: `Welcome ${
            res.payload?.data?.data?.[0]?.attributes?.firstName || ''
          }!`,
          text2: 'You are now logged in. 🎉',
          position: 'top',
        });
        if (redirectToScreen) {
          navigation.replace(redirectToScreen);
        }
        setIsLoading(false);
        const data = applicationProperties.createCartData;
        const wait = new Promise(resolve => setTimeout(resolve, 1000));
        wait.then(() => {
          dispatch(
            createCustomerCart({endpoint: 'carts', data: JSON.stringify(data)}),
          );
        });
      });
    } else {
      Alert.alert(`${response.data?.data?.error_description}`);
      setIsLoading(false);
      CommonLoading.hide();
    }
  };

  const onPressGuestUserLogin = async () => {
    setIsLoading(true);
    const apiData = {
      grant_type: 'password',
      username: userEmail,
      password: password,
    };
    const response = await commonApi.post('token', apiData, {
      'Content-Type': 'multipart/form-data',
    });

    if (response.data?.status === 200) {
      const getToken = await AsyncStorage.getItem('tokenExpiry');
      if (!getToken) {
        await AsyncStorage.setItem(
          'tokenExpiry',
          // response?.data?.data.expires_in.toString(),
          response?.data?.data.access_token,
        );
      }

      var token = await AsyncStorage.getItem('tokenExpiry');

      token = 'Bearer ' + token;
      var token = 'Bearer ' + response?.data?.data?.access_token;
      let carts = await axios.get(`${applicationProperties.baseUrl}/carts`, {
        headers: {
          Authorization: token,
        },
        validateStatus: () => true,
      });
      var cartId = carts?.data?.data?.[0]?.id;
      const cartLength = carts?.data?.data;

      const guestCustomerUniqueId = await AsyncStorage.getItem(
        'guestCustomerUniqueId',
      );
      const url = `${applicationProperties.baseUrl}/guest-carts?include=guest-cart-items`;
      const headers = {
        'Content-Type': 'application/json',
        'X-Anonymous-Customer-Unique-Id': guestCustomerUniqueId,
      };
      await axios
        .get(url, {headers: headers})
        .then(response => {
          const data = response?.data?.included;
          addToCart(data, cartId, token);
        })
        .catch(error => {
          console.error('Error:', error);
        });
      signIn(token);
      dispatch(getCustomerDetails('customers')).then(res => {
        CommonLoading.hide();
        Toast.show({
          type: 'success',
          text1: `Welcome ${
            res.payload?.data?.data?.[0]?.attributes?.firstName || ''
          }!`,
          text2: 'You are now logged in. 🎉',
          position: 'top',
        });
        if (redirectToScreen) {
          navigation.replace(redirectToScreen);
        }
        setIsLoading(false);
        const data = applicationProperties.createCartData;
        const wait = new Promise(resolve => setTimeout(resolve, 1000));
        wait.then(() => {
          dispatch(
            createCustomerCart({endpoint: 'carts', data: JSON.stringify(data)}),
          );
        });
      });
    } else {
      Alert.alert(`${response.data?.data?.error_description}`);
      setIsLoading(false);
      CommonLoading.hide();
    }
  };
  // const loginGuestUser = async () => {
  //   onPressGuestUserLogin();
  // };

  const addToCart = async (data, cartId, token) => {
    for (const item of data) {
      const productData = {
        data: {
          type: 'items',
          attributes: {
            sku: item?.attributes?.sku,
            quantity: item?.attributes?.quantity,
            productOfferReference: item?.attributes?.productOfferReference,
            merchantReference: item?.attributes?.merchantReference,
            salesUnit: {
              id: 0,
              amount: 0,
            },
            productOptions: [null],
          },
        },
      };
      var test = JSON.stringify(productData);
      try {
        const response = await axios.post(
          `${applicationProperties.baseUrl}/carts/${cartId}/items`,
          productData,
          {
            headers: {
              Authorization: token,
            },
            validateStatus: () => true,
          },
        );
        // if (response.status === 201) {
        //   signIn(token);
        //   if (redirectToScreen) {
        //     navigation.replace(redirectToScreen);
        //   }
        // }
        console.log('Success:', response.status);
      } catch (error) {
        if (error.response) {
          console.log('Error Response:', error.response.data);
          console.log('Status Code:', error.response.status);
        } else if (error.request) {
          console.log('No Response Received:', error.request);
        } else {
          console.log('Error:', error.message);
        }
      }
    }
  };
  const onPressSubmit = () => {
    if (hideGuestUserCta === true && isUserLoggedIn === false) {
      console.log('HEREEEE');
      onPressGuestUserLogin();
    } else {
      console.log('HERE');
      onPressLogin();
    }
  };

  // SIGN UP

  const bottomSheetRef = useRef(null);

  const handleExpandPress = useCallback(() => {
    bottomSheetRef.current?.expand();
  }, []);
  const handleClosePress = useCallback(() => {
    bottomSheetRef.current?.close();
  }, []);

  return (
    <ScrollView style={{flex: 1, backgroundColor: 'white'}}>
      <Box flex={1} padding="s16" backgroundColor="white">
        <Box alignItems="flex-end">
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}>
            <Box padding="s4">
              <CrossIcon />
            </Box>
          </TouchableOpacity>
        </Box>
        <Box>
          <HomeHeader />
        </Box>
        <Box mt="s4">
          <SelectAuthMethod
            selectedOption={selectedOption}
            setSelectedOption={setSelectedOption}
          />
        </Box>
        {/* <Text variant="bold24" mb="s16">
        Login to continue
      </Text> */}
        {selectedOption === 'login' ? (
          <Box>
            <Text variant="regular14" color="lightBlack" mr="s4" mb="s12">
              Enter your email to get started
            </Text>
            <TextInput
              style={styles.input}
              placeholder="john.doe@example.com"
              value={userEmail}
              onChangeText={text => {
                setUserEmail(text);
              }}
              autoCapitalize={false}
              keyboardType="email-address"
              placeholderTextColor={theme.colors.lightGrey}
            />
            <Text
              variant="regular14"
              color="lightBlack"
              mr="s4"
              marginVertical="s12">
              Password
            </Text>
            <TextInput
              style={styles.input}
              placeholder="password"
              value={password}
              onChangeText={text => {
                setPassword(text);
              }}
              autoCapitalize={false}
              placeholderTextColor={theme.colors.lightGrey}
            />
            <Box mt="s16">
              {!isLoading ? (
                <>
                  <CommonSolidButton
                    title="LOGIN"
                    onPress={onPressSubmit}
                    disabled={getButtonStatus()}
                  />
                </>
              ) : (
                <Box
                  backgroundColor="sushiittoRed"
                  height={40}
                  borderRadius={theme.spacing.lml}
                  alignItems="center"
                  justifyContent="center">
                  <ActivityIndicator color={'white'} />
                </Box>
              )}
            </Box>
          </Box>
        ) : (
          <>
            <SignUpScreen setSelectedOption={setSelectedOption} />
          </>
        )}
        <Box mt="s0">
          {hideGuestUserCta === true ? (
            <></>
          ) : (
            <Box>
              {/* <Box mt="s16">
                  <CommonSolidButton title="SIGNUP" onPress={onPressSubmit} />
                </Box> */}
              <Box paddingVertical="s16" alignItems="center">
                <Text>OR</Text>
              </Box>
              <Box>
                <CommonOutlineButton
                  title={'Continue as a Guest User'}
                  onPress={() => navigation.navigate('Home')}
                />
              </Box>
            </Box>
          )}
        </Box>
        <Box justifyContent="flex-end" flex={1} paddingVertical="s16">
          <PoweredBySpryker />
        </Box>

        {/* <DynamicSnapPointBottomSheet
          handleExpandPress={handleExpandPress}
          bottomSheetRef={bottomSheetRef}>
          <SignUpScreen />
        </DynamicSnapPointBottomSheet> */}
      </Box>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: theme.colors.inputGrey,
    height: 54,
    width: '100%',
    borderRadius: 8,
    paddingLeft: 16,
    fontSize: 16,
    fontFamily: FONT.Primary,
  },
});
