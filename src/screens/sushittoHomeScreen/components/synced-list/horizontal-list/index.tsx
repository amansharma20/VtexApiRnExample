import React from 'react';
import {FlatList, StyleSheet, TouchableOpacity, View} from 'react-native';

import {DataItem, HorizontalListProps} from '../types';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Text, theme} from '@atoms';

const HorizontalList = ({
  contentContainerStyle,
  data,
  onSelect,
  renderHorizontalItem,
  scrollRef,
  selected,
  setHorizontalPressed,
  verticalScrollRef,
  horizontalListProps,
}: HorizontalListProps) => {
  const insets = useSafeAreaInsets();

  const onItemPress = (id: number | string, i: number) => {
    setHorizontalPressed(true);
    onSelect(id);
    if (verticalScrollRef?.current) {
      verticalScrollRef.current.scrollToLocation({
        animated: true,
        itemIndex: 0,
        sectionIndex: i,
        viewPosition: 0,
        viewOffset: 50,
      });
    }
    if (scrollRef?.current) {
      scrollRef.current.scrollToIndex({
        animated: true,
        index: i,
        viewPosition: 0.25,
      });
    }

    setTimeout(() => {
      setHorizontalPressed(false);
    }, 300);
  };

  const renderItem = ({item, index}: {item: DataItem; index: number}) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => onItemPress(item.id, index)}>
        <View
          style={
            selected === item.id
              ? [styles.itemContainer, styles.itemContainerSelected]
              : styles.itemContainer
          }>
          <Text
            // fontSize={selected === item.id ? 18 : 14}
            // fontWeight={selected === item.id ? '700' : '500'}
            variant={selected === item.id ? 'bold18' : 'regular14'}
            > 
            {item.title}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const getFlatlistProps = () =>
    horizontalListProps ? horizontalListProps : {};

  return (
    <View>
      <View
        style={[
          styles.container,
          {
            // paddingTop: insets.top + 0,
          },
        ]}>
        <FlatList
          bounces={false}
          contentContainerStyle={
            contentContainerStyle
              ? [styles.contentContainerStyle, contentContainerStyle]
              : styles.contentContainerStyle
          }
          data={data}
          horizontal
          initialNumToRender={30}
          // keyExtractor={item => item?.id?.toString()}
          onScrollToIndexFailed={() => {
            // fallBack();
          }}
          ref={scrollRef}
          renderItem={renderItem}
          showsHorizontalScrollIndicator={false}
          {...getFlatlistProps()}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
  },
  contentContainerStyle: {
    backgroundColor: 'white',
    paddingLeft: 16,
    borderColor: theme.colors.border,
    borderBottomWidth: 1,
  },
  itemContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  itemContainerSelected: {},
  linearGradient: {
    bottom: -5,
    height: 5,
    position: 'absolute',
    right: 0,
    width: '100%',
  },
});

export default HorizontalList;
