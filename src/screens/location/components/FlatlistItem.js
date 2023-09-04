/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  View,
  Image,
  useWindowDimensions,
  Pressable,
  StyleSheet,
} from 'react-native';
import Icons from '../../../assets/constants/Icons';
import {Box, Text} from '@atoms';

const Post = props => {
  const post = props.post;
  const setSelectedPlaceId = props.setSelectedPlaceId;
  const width = useWindowDimensions().width;
  const onPress = () => {
    console.log('post.id: ', post.id);
    setSelectedPlaceId(post.id);
  };

  return (
    <Pressable
      style={[styles.container, {width: width - 80}]}
      onPress={onPress}>
      <View
        style={[
          styles.mainBody,
          {
            shadowOpacity: 0.2,
            shadowRadius: 10,
            elevation: 3,
            shadowOffset: {width: 0, height: 0},
          },
        ]}>
        <View style={styles.topContainer}>
          <View style={styles.leftConatiner}>
            <Box flexDirection="row" alignItems="center" mb="s8">
              <Text numberOfLines={1} variant="bold16">
                {post.name} - {post.address}
              </Text>
            </Box>
            {/* <View style={styles.addressContainer}>
              <View style={styles.addressContainerLeft}>
                <Text
                  numberOfLines={1}
                  style={styles.addressText}
                  paddingVertical="s4">
                  {post.address}
                </Text>
              </View>
              <View style={styles.addressContainerRight}>
                <Text
                  style={[
                    styles.addressText,
                    {color: '#DB3E6F', paddingLeft: 10},
                  ]}>
                  {(post.distance / 1000).toFixed(1)} Km
                </Text>
              </View>
            </View> */}
          </View>
          {/* <Image source={Icons.addToCartIcon} style={styles.directionIcon} /> */}
        </View>
        <Text color="sushiittoRed">
          {(post.distance / 1000).toFixed(1)} Km from you
        </Text>

        {/* <Text style={styles.supportText}>SUPPORTED CONNECTORS</Text>

          {post.connector_types.map(connectorTypes => (
            <View style={styles.levelContainer}>
              <View style={styles.levelContainerLeft}>
                <Image
                  source={Icons.addToCartIcon}
                  style={styles.chargingIcon}
                />
                <View style={{paddingLeft: 10}}>
                  <Text style={{color: '#ffffff'}}>
                    {connectorTypes
                      .replace(/-/g, '')
                      .replace(/lvl1dc/g, 'Level 1 DC')
                      .replace(/lvl2dc/g, 'Level 2 DC')
                      .replace(/normalac/g, 'Normal AC')
                      .slice(0, -1)}
                  </Text>
                  <Text style={{color: '#3AAA93', fontSize: 12}}>
                    15kW Fast Charging
                  </Text>
                </View>
              </View>

              <Text style={{color: '#ffffff', fontSize: 16}}>
                x
                {connectorTypes
                  .replace(/-/g, '')
                  .replace(/lvl1dc/g, 'Level 1 DC')
                  .replace(/lvl2dc/g, 'Level 2 DC')
                  .replace(/normalac/g, 'Normal AC')
                  .slice(-1)}
              </Text>
            </View>
          ))} */}

        {/* <Image source={Icons.addToCartIcon} style={styles.downIcon} /> */}
      </View>
    </Pressable>
  );
};

export default Post;

const styles = StyleSheet.create({
  container: {
    padding: 5,
    elevation: 10,
  },
  innerContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
  },
  mainBody: {
    flex: 1,
    padding: 16,
    // paddingTop: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 50,
    marginLeft: 8,
  },
  topContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  leftConatiner: {
    width: '80%',
  },
  addressContainer: {
    flexDirection: 'row',
    color: '#888B8D',
    fontSize: 12,
    alignItems: 'center',
  },
  addressContainerLeft: {
    width: '60%',
  },
  addressContainerRight: {
    width: '40%',
  },
  details: {
    color: '#ffffff',
    fontSize: 12,
  },
  titleText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
  addressText: {
    color: '#ffffff',
    fontSize: 12,
    color: '#888B8D',
    fontSize: 12.5,
  },
  directionIcon: {
    width: 30,
    height: 30,
    tintColor: '#DB3E6F',
    alignSelf: 'center',
    resizeMode: 'contain',
  },
  supportText: {
    color: '#3AAA93',
    paddingVertical: 8,
    fontSize: 12,
  },
  levelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  levelContainerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chargingIcon: {
    width: 30,
    height: 30,
    tintColor: '#ffffff',
    alignSelf: 'center',
    marginBottom: 0,
    resizeMode: 'contain',
  },
  downIcon: {
    width: 18,
    height: 18,
    tintColor: '#ffffff',
    alignSelf: 'center',
    marginBottom: 10,
    resizeMode: 'contain',
  },
});
