/* eslint-disable @typescript-eslint/no-shadow */
import React, {useEffect, useState} from 'react';
import {
  SectionList,
  SectionListData,
  StyleSheet,
  View,
  ViewToken,
} from 'react-native';

import {VerticalListProps} from '../types';
import {Box, Text, theme} from '@atoms';
import HomeHeader from '../../../../home/homeHeader/HomeHeader';
import ContentFullSection from '../../../../home/contentFull/ContentFullSection';
import SelectShippingMethod from '../../../../../components/SelectShippingMethod/SelectShippingMethod';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import PoweredBySpryker from '../../../../../components/PoweredBySpryker';

const VerticalList = ({
  data,
  horizontalPressed,
  horizontalScrollRef,
  mapping,
  renderSectionHeader,
  renderVerticalItem,
  scrollRef,
  selected,
  setSelected,
  verticalListProps,
  headerPassed,
  setHeaderPassed,
  hideComponentWithAnimation,
  showComponentWithAnimation,
}: VerticalListProps) => {
  const insets = useSafeAreaInsets();

  const onViewableItemsChanged = ({
    viewableItems,
  }: {
    viewableItems: ViewToken[];
  }) => {
    if (viewableItems[0] && !viewableItems[0].index && !horizontalPressed) {
      // const id = viewableItems?.[0]?.key;
      const id = viewableItems?.[0]?.section?.id;
      if (id !== selected) {
        setSelected(id);
        if (horizontalScrollRef?.current) {
          horizontalScrollRef.current.scrollToIndex({
            animated: true,
            index: mapping[id],
            viewPosition: 0,
          });
        }
      }
    }
  };

  const fallBack = () => {
    if (horizontalScrollRef?.current) {
      horizontalScrollRef.current.scrollToIndex({
        animated: true,
        index: 0,
        viewPosition: 0,
      });
    }

    if (scrollRef?.current) {
      scrollRef.current.scrollToLocation({
        animated: true,
        itemIndex: 0,
        sectionIndex: 0,
        viewPosition: 0,
      });
    }
  };

  const renderItem = ({item}: {item: any}) => {
    if (renderVerticalItem) {
      return renderVerticalItem(item);
    } else {
      return (
        <View style={[styles.itemContainer]}>
          <Text>{item}</Text>
        </View>
      );
    }
  };

  const renderHeader = ({
    section,
    index,
  }: {
    section: SectionListData<any>;
  }): React.ReactElement<
    any,
    string | React.JSXElementConstructor<any>
  > | null => {
    if (renderSectionHeader) {
      return renderSectionHeader(section);
    } else {
      return (
        <Box
          paddingHorizontal="s16"
          justifyContent="flex-end"
          paddingVertical="s8">
          <Text fontSize={18} variant="bold18">
            {section.title} {`(${section.data.length})`}
          </Text>
        </Box>
      );
    }
  };

  const keyExtractor = (item: any, index: number) =>
    item?.id?.toString() || index?.toString();

  const getSectionListProps = () =>
    verticalListProps ? verticalListProps : {};

  function flattenData(data) {
    const flattenedData = [];

    for (const item of data) {
      flattenedData.push(item.title);

      for (const subItem of item.data) {
        flattenedData.push(subItem);
      }
    }

    return flattenedData;
  }

  const flattenedData = flattenData(data);

  const stickyHeaderIndices = flattenedData
    .map((item, index) => {
      if (typeof item === 'string') {
        return index;
      } else {
        return null;
      }
    })
    .filter(item => item !== null) as number[];

  const handleScroll = event => {
    const scrollOffsetY = event.nativeEvent.contentOffset.y;
    const headerComponentHeight = 460; // Replace this with the actual height of your header component

    // Check if the scroll offset has passed the header component
    if (scrollOffsetY > headerComponentHeight) {
      if (!headerPassed) {
        setHeaderPassed(true);
        showComponentWithAnimation();
        console.log('Scrolled past the header component!');
        // You can now perform any actions or state changes here
        // to indicate that the header component is no longer visible.
      }
    } else {
      if (headerPassed) {
        setHeaderPassed(false);
        hideComponentWithAnimation();
      }
    }
  };

  useEffect(() => {
    hideComponentWithAnimation();
  }, []);

  return (
    <Box flex={1}>
      <SectionList
        contentContainerStyle={[styles.contentContainerStyle]}
        initialNumToRender={40}
        keyExtractor={keyExtractor}
        onScrollToIndexFailed={() => {
          fallBack();
        }}
        onViewableItemsChanged={onViewableItemsChanged}
        ref={scrollRef}
        renderItem={renderItem}
        renderSectionHeader={renderHeader}
        sections={data}
        showsVerticalScrollIndicator={false}
        stickySectionHeadersEnabled={false}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 50,
        }}
        {...getSectionListProps()}
        ListHeaderComponent={
          <Box justifyContent="center">
            <HomeHeader />
            <ContentFullSection />
            <SelectShippingMethod />
          </Box>
        }
        onScroll={handleScroll}
        ListHeaderComponentStyle={{paddingHorizontal: 0}}
        ListFooterComponent={
          <Box paddingVertical="s16">
            <PoweredBySpryker />
          </Box>
        }
      />

      {/* <Box flex={1} backgroundColor="white">
        {flattenedData?.length > 0 ? (
          <>
            <FlashList
              keyExtractor={keyExtractor}
              onScrollToIndexFailed={() => {
                fallBack();
              }}
              onViewableItemsChanged={onViewableItemsChanged}
              ref={scrollRef}
              showsVerticalScrollIndicator={false}
              stickySectionHeadersEnabled={false}
              viewabilityConfig={{
                itemVisiblePercentThreshold: 50,
              }}
              {...getSectionListProps()}
              data={flattenedData}
              renderItem={({item}) => {
                if (typeof item === 'string') {
                  // Rendering header
                  return (
                    <Box
                      paddingVertical="s4"
                      backgroundColor="white"
                      paddingHorizontal="paddingHorizontal">
                      <Text fontWeight="700" fontSize={20}>
                        {item}
                      </Text>
                    </Box>
                  );
                } else {
                  // Render item
                  return (
                    <Box paddingHorizontal="paddingHorizontal">
                      <Text>{item.name}</Text>
                    </Box>
                  );
                }
              }}
              // stickyHeaderIndices={stickyHeaderIndices}
              getItemType={item => {
                // To achieve better performance, specify the type based on the item
                return typeof item === 'string' ? 'sectionHeader' : 'row';
              }}
              estimatedItemSize={100}
              estimatedListSize={{
                height: Dimensions.get('window').height,
                width: Dimensions.get('screen').width,
              }}
            />
          </>
        ) : (
          <></>
        )}
      </Box> */}
    </Box>
  );
};

const styles = StyleSheet.create({
  contentContainerStyle: {
    paddingBottom: 100,
  },
  header: {
    color: 'white',
    fontSize: 32,
  },
  headerContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 8,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  innerHeaderContainer: {
    backgroundColor: '#252728',
    borderRadius: 3,
    height: 23,
    justifyContent: 'center',
    paddingHorizontal: 12,
    width: '100%',
  },
  itemContainer: {
    backgroundColor: 'rgba(0,0,0,0.1)',
    marginBottom: 8,
    paddingHorizontal: 32,
    paddingVertical: 16,
  },
});

export default VerticalList;
