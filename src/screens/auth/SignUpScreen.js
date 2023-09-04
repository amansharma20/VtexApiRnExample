/* eslint-disable react-native/no-inline-styles */
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import {Box, FONT, Text, theme} from '@atoms';
import CommonChipSelector from '../../components/CommonChipSelector/CommonChipSelector';
import CommonSolidButton from '../../components/CommonSolidButton/CommonSolidButton';
import {api} from '../../api/SecureAPI';
import BouncyCheckbox from 'react-native-bouncy-checkbox';

const SignUpScreen = ({setSelectedOption}) => {
  const [signUpApiResponse, setSignUpApiResponse] = useState([]);

  // GENDER
  const GENDER_DATA = [
    {
      title: 'Male',
      value: 'Male',
    },
    {
      title: 'Female',
      value: 'Female',
    },
  ];

  const [selectedGenderIndex, setSelectedGenderIndex] = useState(null);

  const genderApiData = GENDER_DATA[selectedGenderIndex]?.value ?? null;

  // SALUTATION
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

  const [selectedSalutationIndex, setSelectedSalutationIndex] = useState(null);

  const salutationApiData =
    SALUTATION_DATA[selectedSalutationIndex]?.value ?? null;

  // FIRST NAME
  const [firstName, setFirstName] = useState('');

  // LAST NAME
  const [lastName, setLastName] = useState('');

  // EMAIL
  const [userEmail, setUserEmail] = useState('');

  function isValidEmail(email) {
    // Regular expression for email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  }

  // PASSWORD
  const [password, setPassword] = useState('');

  // CONFIRM PASSWORD
  const [confirmPassword, setConfirmPassword] = useState('');

  function isValidPassword(password) {
    // Regular expression for password validation (at least one letter and one number)
    const passwordPattern = /^(?=.*[a-zA-Z])(?=.*\d).+$/;
    return passwordPattern.test(password);
  }

  function arePasswordsValid(password, confirmPassword) {
    // Check if either password or confirm password is null
    if (password === '' || confirmPassword === '') {
      return false;
    }

    // Check if password is more than 7 characters long
    if (password.length <= 7) {
      return false;
    }

    // Check if the passwords match
    return password === confirmPassword;
  }

  const passwordsMatch = arePasswordsValid(password, confirmPassword);

  // TERMS

  const [isTermsChecked, setIsTermsChecked] = useState(false);

  const getButtonStatus = () => {
    if (
      selectedGenderIndex == null ||
      selectedSalutationIndex == null ||
      firstName === '' ||
      lastName === '' ||
      isValidEmail(userEmail) === false ||
      passwordsMatch === false ||
      isTermsChecked === false
    ) {
      return true;
    } else {
      return false;
    }
  };

  const apiData = {
    data: {
      type: 'customers',
      attributes: {
        salutation: salutationApiData,
        firstName: firstName,
        lastName: lastName,
        email: userEmail,
        gender: genderApiData,
        password: password,
        confirmPassword: confirmPassword,
        acceptedTerms: true,
      },
    },
  };

  const onPressSignUp = async () => {
    await api.post('customers', apiData).then(response => {
      if (response.data.status === 201) {
        setSignUpApiResponse(response.data?.data);
        Alert.alert(
          'Almost there!',
          'We sent you an email to validate your email address. Please confirm it to be able to log in.',
          [
            {
              text: 'OK',
              onPress: () => {
                setSelectedOption('login');
              },
            },
          ],
        );
      } else {
        Alert.alert(response.data?.data?.errors?.[0]?.detail);
      }
    });
  };

  return (
    <Box flex={1} backgroundColor="white">
      {/* <Text variant="bold24">Sign Up</Text> */}
      <CommonChipSelector
        title={'Gender*'}
        DATA={GENDER_DATA}
        selectedIndex={selectedGenderIndex}
        setSelectedIndex={setSelectedGenderIndex}
      />
      <CommonChipSelector
        title={'Salutation*'}
        DATA={SALUTATION_DATA}
        selectedIndex={selectedSalutationIndex}
        setSelectedIndex={setSelectedSalutationIndex}
      />
      <Text variant="regular14" color="lightBlack" mr="s4" marginVertical="s12">
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

      <Text variant="regular14" color="lightBlack" mr="s4" marginVertical="s12">
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

      <Text variant="regular14" color="lightBlack" mr="s4" marginVertical="s12">
        Email*
      </Text>
      <TextInput
        style={styles.input}
        placeholder=""
        value={userEmail}
        onChangeText={text => {
          setUserEmail(text);
        }}
        autoCapitalize={false}
        keyboardType="email-address"
        placeholderTextColor={theme.colors.lightGrey}
      />

      <Text variant="regular14" color="lightBlack" mr="s4" marginVertical="s12">
        Password*
      </Text>
      <TextInput
        style={styles.input}
        placeholder=""
        value={password}
        onChangeText={text => {
          setPassword(text);
        }}
        autoCapitalize={false}
        placeholderTextColor={theme.colors.lightGrey}
      />

      <Text variant="regular14" color="lightBlack" mr="s4" marginVertical="s12">
        Confirm Password*
      </Text>
      <TextInput
        style={styles.input}
        placeholder=""
        value={confirmPassword}
        onChangeText={text => {
          setConfirmPassword(text);
        }}
        autoCapitalize={false}
        placeholderTextColor={theme.colors.lightGrey}
      />
      <Box mt="s12" flexDirection="row" alignItems="center">
        <BouncyCheckbox
          fillColor={theme.colors.sushiittoRed}
          disableBuiltInState
          isChecked={isTermsChecked}
          onPress={() => {
            setIsTermsChecked(!isTermsChecked);
          }}
        />
        <TouchableOpacity
          style={{paddingVertical: 4}}
          onPress={() => {
            setIsTermsChecked(!isTermsChecked);
          }}>
          <Text>Accept Terms</Text>
        </TouchableOpacity>
      </Box>
      <Box paddingVertical="s16">
        <CommonSolidButton
          title={'SIGN UP'}
          onPress={onPressSignUp}
          disabled={getButtonStatus()}
        />
      </Box>
    </Box>
  );
};

export default SignUpScreen;

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
