/* eslint-disable react-hooks/exhaustive-deps */
import {StyleSheet, TouchableOpacity} from 'react-native';
import React, {useEffect} from 'react';
import {Box, Text, theme} from '@atoms';
import {useNavigation} from '@react-navigation/native';
import BouncyCheckbox from 'react-native-bouncy-checkbox';

const ShoppingListItem = ({
  item,
  onPress,
  selectedShoppingListId,
  showCheckMark,
}) => {
  const navigation = useNavigation();
  const wishlist = item?.item?.attributes;

  const onPressItem = () => {
    if (onPress) {
      onPress();
    } else {
      navigation.navigate('WishlistItemsScreen', {id: item?.item?.id});
    }
  };

  const showCheckMarkBool = () => {
    if (item?.item?.id == selectedShoppingListId) {
      return true;
    } else {
      return false;
    }
  };

  useEffect(() => {
    showCheckMarkBool();
  }, [selectedShoppingListId]);

  return (
    <Box style={styles.wishlistItemContainer}>
      <TouchableOpacity onPress={onPressItem} style={styles.quantityButton}>
        <Box
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center">
          <Box>
            <Text style={styles.wishlistItemName}>{wishlist.name}</Text>
            <Text style={styles.wishlistItemNumberOfItems}>
              Total Items :
              {wishlist.numberOfItems !== null ? wishlist.numberOfItems : '0'}
            </Text>
          </Box>
          <Box>
            {showCheckMark === true ? (
              <>
                <BouncyCheckbox
                  disableBuiltInState
                  isChecked={showCheckMarkBool()}
                  onPress={onPress}
                  iconStyle={{
                    borderColor: theme.colors.lightGreen,
                  }}
                  fillColor={theme.colors.lightGreen}
                />
              </>
            ) : (
              <></>
            )}
          </Box>
        </Box>
      </TouchableOpacity>
    </Box>
  );
};

export default ShoppingListItem;

const styles = StyleSheet.create({
  wishlistItemContainer: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 8,
    backgroundColor: 'white',
  },
  wishlistItemName: {
    fontSize: 16,
  },
});
