/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {Box, FONT, Text, theme} from '@atoms';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  TextInput,
  SafeAreaView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import CommonChipSelector from '../../components/CommonChipSelector/CommonChipSelector';
import CommonSolidButton from '../../components/CommonSolidButton/CommonSolidButton';
import {api} from '../../api/SecureAPI';
import {Toast} from 'react-native-toast-message/lib/src/Toast';
import CommonHeader from '../../components/CommonHeader/CommonHeader';
import {useDispatch, useSelector} from 'react-redux';
import {getCheckoutData} from '../../redux/checkoutDataApi/CheckoutApiAsyncThunk';

const AddAddressScreen = props => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const cartId = props.route.params?.cartId;
  const redirectToScreen = props.route.params?.redirectToScreen;

  const profileId = useSelector(
    state =>
      state.getCustomerDetailsApiSlice.customerDetails?.data?.data?.[0]?.id ||
      '',
  );

  const SALUTATION_DATA = [
    {
      title: 'Mr.',
      value: 'Mr',
    },
    {
      title: 'Ms.',
      value: 'Ms',
    },
    {
      title: 'Mrs.',
      value: 'Mrs',
    },
  ];

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [selectedSalutationIndex, setSelectedSalutationIndex] = useState(null);
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [phone, setPhone] = useState('');
  const [iso2Code, setIso2Code] = useState('');

  const salutationApiData =
    SALUTATION_DATA[selectedSalutationIndex]?.value ?? null;
  const [isLoading, setIsLoading] = useState(false);

  //   const getButtonStatus = () => {
  //     if (isValidEmail(userEmail) === false || password.length === 0) {
  //       return true;
  //     } else {
  //       return false;
  //     }
  //   };
  const apiData = {
    data: {
      type: 'addresses',
      attributes: {
        customer_reference: `${profileId}`,
        salutation: salutationApiData,
        firstName: firstName,
        lastName: lastName,
        address1: address1,
        address2: address2,
        zipCode: zipCode,
        city: city,
        country: country,
        iso2Code: 'DE',
        phone: phone,
        isDefaultShipping: false,
        isDefaultBilling: false,
      },
    },
  };

  const checkoutData = {
    data: {
      attributes: {
        idCart: cartId,
        shipmentMethods: [],
      },
      type: 'checkout-data',
    },
  };

  const onPress = async () => {
    setIsLoading(true);
    await api
      .post(`customers/${profileId}/addresses`, apiData)
      .then(response => {
        console.log('response: ', response?.data?.data);
        if (response.data.status === 201) {
          setAddress1('');
          setAddress2('');
          setCity('');
          setCountry('');
          setFirstName('');
          setLastName('');
          setIso2Code('');
          setPhone('');
          setZipCode('');
          dispatch(
            getCheckoutData({
              endpoint:
                'checkout-data?include=shipments%2Cshipment-methods%2Caddresses%2Cpayment-methods%2Citems',
              data: checkoutData,
            }),
          ).then(() => {
            setIsLoading(false);
            Toast.show({
              type: 'success',
              text1: 'Address added successfully 🎉',
              position: 'top',
            });
            if (redirectToScreen) {
              navigation.navigate(redirectToScreen);
            } else {
              navigation.goBack();
            }
          });
        } else {
          setIsLoading(false);
          Alert.alert(`${response.data.data?.errors?.[0]?.detail}`);
          // Toast.show({
          //   type: 'error',
          //   text1: 'Something went wrong 🎉',
          //   position: 'top',
          // });
        }
      });
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <CommonHeader title={'Enter address details'} />

      <ScrollView
        style={{flex: 1, backgroundColor: 'white'}}
        contentContainerStyle={{paddingBottom: 40}}>
        <Box flex={1} backgroundColor="white">
          {/* <Box alignItems="flex-end">
            <TouchableOpacity
              onPress={() => {
                navigation.goBack();
              }}>
              <Box padding="s4">
                <CrossIcon />
              </Box>
            </TouchableOpacity>
          </Box> */}
          {/* <Box>
            <HomeHeader />
          </Box> */}
          <Box paddingHorizontal="paddingHorizontal">
            <Box>
              <CommonChipSelector
                title={'Salutation*'}
                DATA={SALUTATION_DATA}
                selectedIndex={selectedSalutationIndex}
                setSelectedIndex={setSelectedSalutationIndex}
              />

              <Text
                variant="regular14"
                color="lightBlack"
                mr="s4"
                marginVertical="s12">
                First Name*
              </Text>
              <TextInput
                style={styles.input}
                placeholder=""
                value={firstName}
                onChangeText={text => {
                  setFirstName(text);
                }}
                autoCapitalize={false}
                keyboardType="default"
                placeholderTextColor={theme.colors.lightGrey}
              />

              <Text
                variant="regular14"
                color="lightBlack"
                mr="s4"
                marginVertical="s12">
                Last Name*
              </Text>
              <TextInput
                style={styles.input}
                placeholder=""
                value={lastName}
                onChangeText={text => {
                  setLastName(text);
                }}
                keyboardType="default"
                autoCapitalize={false}
                placeholderTextColor={theme.colors.lightGrey}
              />
              <Text
                variant="regular14"
                color="lightBlack"
                mr="s4"
                marginVertical="s12">
                Address1*
              </Text>
              <TextInput
                style={styles.input}
                placeholder=""
                value={address1}
                onChangeText={text => {
                  setAddress1(text);
                }}
                keyboardType="default"
                autoCapitalize={false}
                placeholderTextColor={theme.colors.lightGrey}
              />
              <Text
                variant="regular14"
                color="lightBlack"
                mr="s4"
                marginVertical="s12">
                Address2*
              </Text>
              <TextInput
                style={styles.input}
                placeholder=""
                value={address2}
                onChangeText={text => {
                  setAddress2(text);
                }}
                keyboardType="default"
                autoCapitalize={false}
                placeholderTextColor={theme.colors.lightGrey}
              />
              <Text
                variant="regular14"
                color="lightBlack"
                mr="s4"
                marginVertical="s12">
                Zip Code*
              </Text>
              <TextInput
                style={styles.input}
                placeholder=""
                value={zipCode}
                onChangeText={text => {
                  setZipCode(text);
                }}
                keyboardType="default"
                autoCapitalize={false}
                placeholderTextColor={theme.colors.lightGrey}
              />
              <Text
                variant="regular14"
                color="lightBlack"
                mr="s4"
                marginVertical="s12">
                City*
              </Text>
              <TextInput
                style={styles.input}
                placeholder=""
                value={city}
                onChangeText={text => {
                  setCity(text);
                }}
                keyboardType="default"
                autoCapitalize={false}
                placeholderTextColor={theme.colors.lightGrey}
              />
              <Text
                variant="regular14"
                color="lightBlack"
                mr="s4"
                marginVertical="s12">
                Country*
              </Text>
              <TextInput
                style={styles.input}
                placeholder=""
                value={country}
                onChangeText={text => {
                  setCountry(text);
                }}
                keyboardType="default"
                autoCapitalize={false}
                placeholderTextColor={theme.colors.lightGrey}
              />
              <Text
                variant="regular14"
                color="lightBlack"
                mr="s4"
                marginVertical="s12">
                Iso2Code*
              </Text>
              <TextInput
                style={styles.input}
                placeholder=""
                value={iso2Code}
                onChangeText={text => {
                  setIso2Code(text);
                }}
                keyboardType="default"
                autoCapitalize={false}
                placeholderTextColor={theme.colors.lightGrey}
              />
            </Box>
          </Box>
        </Box>
      </ScrollView>
      <Box
        padding="paddingHorizontal"
        backgroundColor="white"
        style={theme.cardVariants.bottomButtonShadow}>
        {!isLoading ? (
          <>
            <CommonSolidButton
              title="Save Address"
              onPress={onPress}
              //   disabled={getButtonStatus()
              disabled={false}
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
    </SafeAreaView>
  );
};
export default AddAddressScreen;
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
