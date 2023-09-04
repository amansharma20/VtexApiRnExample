import React, {useEffect} from 'react';
import {Box, Text, theme} from '@atoms';
import {FlatList, StyleSheet, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useIsUserLoggedIn} from '../../hooks/useIsUserLoggedIn';
import LoginScreen from '../auth/LoginScreen';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import PoweredBySpryker from '../../components/PoweredBySpryker';
import {api} from '../../api/SecureAPI';
import {applicationProperties} from '../../utils/application.properties';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();

  const navigation = useNavigation();
  const {isUserLoggedIn} = useIsUserLoggedIn();
  console.log('isUserLoggedIn: ', isUserLoggedIn);

  const dataArray = [
    {
      name: 'Profile',
      onPress: function () {
        isUserLoggedIn
          ? navigation.navigate('PersonalDetailsScreen')
          : navigation.navigate('LoginScreen', {
              redirectToScreen: 'PersonalDetailsScreen',
            });
      },
    },
    {
      name: 'Your Orders',
      onPress: function () {
        navigation.navigate('YourOrdersScreen');
      },
    },
    // {
    //   name: 'Shopping List',
    //   onPress: function () {
    //     navigation.navigate('WishlistScreen');
    //   },
    // },

    // {
    //   name: 'Contact Us',
    //   onPress: function () {},
    // },
    // {
    //   name: 'Feedback',
    //   onPress: function () {},
    // },
    {
      name: 'Language',
      onPress: function () {},
    },
    // {
    //   name: 'Sushitto Menu',
    //   onPress: function () {
    //     navigation.navigate('SushittoHomeScreen');
    //   },
    // },
    {
      name: 'Create Your Roll',
      onPress: function () {
        navigation.navigate('ConfiguredBundleScreen');
      },
    },
    {
      name: 'Add Address',
      onPress: function () {
        navigation.navigate('AddAddressScreen');
      },
    },
  ];

  const renderItem = ({item}) => {
    return (
      <TouchableOpacity
        style={[styles.itemContainer]}
        onPress={() => {
          item.onPress();
        }}>
        <Box flexDirection="row" alignItems="center">
          <Text variant="regular18" style={{paddingLeft: 10}}>
            {item.name}
          </Text>
        </Box>
        <Box>
          <Text>→</Text>
        </Box>
      </TouchableOpacity>
    );
  };

  // useEffect(() => {
  //   var myHeaders = new Headers();
  //   myHeaders.append('Content-Type', 'application/json');
  //   myHeaders.append(
  //     'Authorization',
  //     'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiJmcm9udGVuZCIsImp0aSI6IjcwODI4NWU1NzhhODUyNDZmMTM4NGVlMmMwMjNmODg2ZDkyMDRjZDg0NWE0MDRjMTFjNjI3YzVhYjc2MDI2OGQ4NGViNDcyNGM4MzdlZmQyIiwiaWF0IjoxNjkxMDQzMzAzLjYwNjQxOTEsIm5iZiI6MTY5MTA0MzMwMy42MDY0MjEsImV4cCI6MTY5MTA3MDQwNiwic3ViIjoie1wiaWRfYWdlbnRcIjpudWxsLFwiY3VzdG9tZXJfcmVmZXJlbmNlXCI6XCJERS0tMjFcIixcImlkX2N1c3RvbWVyXCI6MjF9Iiwic2NvcGVzIjpbImN1c3RvbWVyIl19.hSPTvM2ShhCtW0ZGGk35syMqHGMxNS6CIOdq26wCQH4Pj4-W5GGmLgEMRKaGVXrOakmcyFWK15RoqK1CjbVPjOvmG9iF3E9hOsFapCRipkuyl-qnEsy4wJxN41BzR0xLO9H2J4u5n8Msfk-4UoP3sjJ_OKpExRCP0VqCIV-E6whIdQMK15swFVggda9lLLuEvpQZ_zWLVrbJ-9IjuTTTCR6uBQzM-6GlPTyNHj_Y_AAowllMxzr52a9casRErS0F1AiNukaeveMRjUtf9pkFFCaMsLbdQE1wFOszp4U6zuy2tfXz9jYmoCedbKI8NPLdvAYaez6ZbQhV1iyT_EWClQ',
  //   );

  //   var raw = JSON.stringify({
  //     data: {
  //       type: 'carts',
  //       attributes: {
  //         priceMode: 'NET_MODE',
  //         currency: 'USD',
  //         store: 'US',
  //         name: 'new',
  //       },
  //     },
  //   });

  //   var requestOptions = {
  //     method: 'POST',
  //     headers: myHeaders,
  //     body: raw,
  //     redirect: 'follow',
  //   };

  //   fetch('http://103.113.36.20:9003/carts', requestOptions)
  //     .then(response => response.text())
  //     .then(result => console.log(result))
  //     .catch(error => console.log('error', error));
  // }, []);

  // useEffect(() => {
  //   api
  //     .post('carts', JSON.stringify(applicationProperties.createCartData))
  //     .then(res => {
  //       console.log('res: ', res);
  //     });
  // }, []);

  return (
    <Box style={{paddingTop: insets.top}} backgroundColor="background" flex={1}>
      {isUserLoggedIn ? (
        <>
          <Box flex={1}>
            <FlatList
              data={dataArray}
              renderItem={renderItem}
              key={Math.random()}
            />
            <Box paddingVertical="s16">
              <PoweredBySpryker />
            </Box>
          </Box>
        </>
      ) : (
        <>
          <LoginScreen />
        </>
      )}
    </Box>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    height: 64,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: theme.colors.border,
    marginHorizontal: theme.spacing.paddingHorizontal,
    justifyContent: 'space-between',
  },
});
