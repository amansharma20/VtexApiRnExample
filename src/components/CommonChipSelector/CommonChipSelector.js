/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import React, {useEffect, useState} from 'react';
import {Box, Text, theme} from '@atoms';
import {FlatList, TouchableOpacity} from 'react-native';
import BouncyCheckbox from 'react-native-bouncy-checkbox';

const CommonChipSelector = ({DATA, selectedIndex, setSelectedIndex, title}) => {
  const [flatListArray, setFlatListArray] = useState([]);

  const Item = ({item}) => {
    const onPressItem = () => {
      let newArr = [];
      if ((flatListArray || item.index !== -1) && item.isSelected === false) {
        setSelectedIndex(item.index);
        flatListArray[item.index].isSelected = !item.isSelected;
        flatListArray
          .filter(filterItem => filterItem !== flatListArray[item.index])
          .map(newItem => (newItem.isSelected = false));
        newArr.push(...flatListArray);
        setFlatListArray(newArr);
      }
    };

    return (
      <TouchableOpacity
        style={{
          marginTop: 6,
          marginRight: 6,
          borderRadius: 100,
        }}
        activeOpacity={0.8}
        onPress={onPressItem}>
        <Box
          paddingVertical="s12"
          paddingHorizontal="paddingHorizontal"
          flexDirection="row"
          // flexWrap="wrap"
          backgroundColor="inputGrey"
          borderRadius={100}>
          <BouncyCheckbox
            disableBuiltInState
            isChecked={item.isSelected}
            onPress={onPressItem}
            iconStyle={{
              borderColor: item?.isSelected
                ? theme.colors.sushiittoRed
                : theme.colors.lightGrey,
            }}
            fillColor={theme.colors.sushiittoRed}
            size={20}
          />
          <Box flexShrink={1} justifyContent="center">
            <Text
              variant="regular14LightBlack"
              lineHeight={20}
              numberOfLines={1}
              color={item?.isSelected ? 'lightBlack' : 'lightGrey'}>
              {item.title}
            </Text>
          </Box>
        </Box>
      </TouchableOpacity>
    );
  };

  const renderItem = ({item}) => <Item item={item} />;

  const addOptions = DATA?.map((item, index) => {
    return {
      title: item.title,
      subTitle: item.subTitle,
      isSelected: index == selectedIndex ? true : false,
      index: index,
    };
  });

  useEffect(() => {
    setFlatListArray(addOptions);
  }, []);

  return (
    <Box pt="s12">
      <Text variant="regular14" color="lightBlack" lineHeight={18}>
        {title}
      </Text>
      <FlatList
        data={flatListArray}
        renderItem={renderItem}
        keyExtractor={item => item.index}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
        numColumns={3}
        columnWrapperStyle={{
          flexWrap: 'wrap',
        }}
      />
    </Box>
  );
};

export default CommonChipSelector;
