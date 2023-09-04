/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {Image, TouchableOpacity, View} from 'react-native';
import {Marker} from 'react-native-maps';
import Text from '../../../atoms/text';
import {theme} from '../../../atoms/theme';
import Box from '../../../atoms/box';
import Icons from '../../../assets/constants/Icons';

const CustomMarker = props => {
  const {coordinate, isSelected, id, setSelectedPlaceId} = props;
  return (
    <Marker
      coordinate={coordinate}
      onPress={() => {
        setSelectedPlaceId(id);
      }}>
      <Box>
        <View
          style={{
            backgroundColor: isSelected ? theme.colors.sushiittoRed : '#6C7177',
            padding: 5,
            borderRadius: 20,
          }}>
          <Text
            variant="bold14"
            style={{
              color: isSelected ? 'white' : 'white',
            }}>
            {id}
          </Text>
        </View>
      </Box>
    </Marker>
  );
};

export default CustomMarker;
