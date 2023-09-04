/* eslint-disable react/no-unstable-nested-components */
import React, {useEffect, useState} from 'react';
import {Box, Text, theme} from '@atoms';
import {Button, FlatList, TouchableOpacity} from 'react-native';
import BouncyCheckbox from 'react-native-bouncy-checkbox';

const CommonOptionsSelector = ({
  DATA,
  selectedIndex,
  setSelectedIndex,
  onPress,
  handleClosePress,
  hideContinueButton,
}) => {
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
      if (handleClosePress) {
        const wait = new Promise(resolve => setTimeout(resolve, 500));
        wait.then(() => {
          handleClosePress();
        });
      }
    };

    return (
      <TouchableOpacity activeOpacity={0.8} onPress={onPressItem}>
        {/* <Text style={styles.horizontalLine} /> */}
        <Box flex={1} flexDirection="row" mb="s12">
          <BouncyCheckbox
            disableBuiltInState
            isChecked={item.isSelected}
            onPress={onPressItem}
            iconStyle={{
              borderColor: theme.colors.sushiittoRed,
            }}
            fillColor={theme.colors.sushiittoRed}
            size={20}
          />
          <Box width={'100%'} flexShrink={1} justifyContent="center">
            {item.firstName != undefined ? (
              <>
                <Text variant="bold14" lineHeight={20} numberOfLines={2}>
                  {item.firstName}
                </Text>
                <Text
                  variant="regular14LightBlack"
                  lineHeight={20}
                  numberOfLines={2}>
                  {item.title}
                </Text>
              </>
            ) : (
              <Text
                variant="regular14LightBlack"
                lineHeight={20}
                numberOfLines={2}
                // fontWeight="700"
              >
                {item.title}
              </Text>
            )}
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
      isSelected: index === selectedIndex ? true : false,
      index: index,
      firstName: item?.firstName,
      type: item?.type,
    };
  });

  useEffect(() => {
    setFlatListArray(addOptions);
  }, []);

  return (
    <Box>
      <FlatList
        data={flatListArray}
        renderItem={renderItem}
        keyExtractor={item => item.index}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{marginBottom: theme.spacing.s12}}
      />
      {!hideContinueButton && (
        <Box>
          <Button title="CONTINUE" onPress={onPress} />
        </Box>
      )}
    </Box>
  );
};

export default CommonOptionsSelector;
