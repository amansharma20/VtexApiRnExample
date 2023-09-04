import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  ActivityIndicator,
  Button,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {getCustomerDetails} from '../../redux/profileApi/ProfileApiAsyncThunk';
import CommonHeader from '../../components/CommonHeader/CommonHeader';
import {AuthContext} from '../../navigation/StackNavigator';
import Text from '../../atoms/text';
import {theme} from '../../atoms/theme';
import CommonSolidButton from '../../components/CommonSolidButton/CommonSolidButton';

export default function PersonalDetailsScreen() {
  const {signOut} = useContext(AuthContext);
  const dispatch = useDispatch();
  const profileDataAttributes = useSelector(
    state =>
      state.getCustomerDetailsApiSlice.customerDetails?.data?.data?.[0]
        ?.attributes || {},
  );

  const [isLoading, setIsLoading] = useState(false);

  const onPressLogout = () => {
    signOut();
  };

  useEffect(() => {
    setIsLoading(true);
    dispatch(getCustomerDetails('customers')).then(() => {
      setIsLoading(false);
    });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={theme.colors.sushiittoRed} />
        </View>
      ) : (
        <>
          <CommonHeader title={'Personal Details'} />
          <View style={styles.profileDetailsContainer}>
            <ProfileRow
              label="First Name"
              value={profileDataAttributes.firstName}
            />
            <ProfileRow
              label="Last Name"
              value={profileDataAttributes.lastName}
            />
            <ProfileRow
              label="Salutation"
              value={profileDataAttributes.salutation}
            />
            <ProfileRow label="Email" value={profileDataAttributes.email} />
            <ProfileRow label="Gender" value={profileDataAttributes.gender} />
            {/* <ProfileRow label="Date Of Birth" value={profileDataAttributes.dateOfBirth} /> */}
          </View>
        </>
      )}
      <View style={{paddingHorizontal: 20, paddingBottom: 10}}>
        <CommonSolidButton title="LOGOUT" onPress={onPressLogout} />
      </View>
    </SafeAreaView>
  );
}

const ProfileRow = ({label, value}) => {
  return (
    <View style={styles.profileRow}>
      <Text variant="bold18" style={styles.label}>
        {label}
      </Text>
      <Text variant="bold18" style={styles.value}>
        {value}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileDetailsContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  profileRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  label: {
    fontSize: 16,
    // fontWeight: 'bold',
    color: '#333',
  },
  value: {
    fontSize: 16,
    color: '#666',
  },
  logoutButtonContainer: {
    padding: 20,
  },
});
