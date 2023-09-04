import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  FlatList,
  Animated,
  LayoutAnimation,
  ActivityIndicator,
} from 'react-native';
import {commonApi} from '../../../api/CommanAPI';
import {Box, theme} from '@atoms';

const CategorySection = () => {
  const navigation = useNavigation();

  const [isLoading, setIsLoading] = useState(true);

  const [categoriesData, setCategoriesData] = useState([]);

  const firstItem = categoriesData?.[0]?.nodeId || null;
  const [expandedItem, setExpandedItem] = useState(firstItem);
  const animation = useRef(new Animated.Value(0)).current;

  const handleItemPress = nodeId => {
    setExpandedItem(expandedItem === nodeId ? null : nodeId);
    LayoutAnimation.configureNext({
      ...LayoutAnimation.Presets.linear,
      duration: 200,
    });
  };

  useEffect(() => {
    setExpandedItem(firstItem);
  }, [firstItem]);

  useEffect(() => {
    setIsLoading(true);
    async function getCategories() {
      try {
        const response = await commonApi.get('category-trees');
        if (response.data.status === 200) {
          setCategoriesData(
            response.data.data.data[0]?.attributes?.categoryNodesStorage,
          );
          setIsLoading(false);
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.log('An error occurred while fetching categories:', error);
        setIsLoading(false);
      }
    }

    getCategories();
  }, []); // Or [] if effect doesn't need props or state

  useEffect(() => {
    categoriesData.push(
      {
        children: [],
        name: 'Bundled Products',
        // nodeId: 15,
        // order: 80,
        url: 'Bundled Products',
      },
      {
        children: [],
        name: 'Configure Products',
        // nodeId: 15,
        // order: 80,
        url: 'Configure Products',
      },
    );
  }, [categoriesData]);

  const renderSubCategory = ({item}) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          navigation.navigate('ProductsListScreen', {
            nodeId: item?.nodeId,
            title: item?.name,
          });
        }}
        style={styles.subCategoryItem}>
        <Text style={styles.expandedText}>{item?.name}</Text>
        <Text style={styles.expandedText}>→</Text>
      </TouchableOpacity>
    );
  };

  const renderCategory = ({item}) => {
    const expandStyle = {
      maxHeight: animation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 200],
      }),
      opacity: animation,
    };

    const onPressHeader = () => {
      console.log('item: ', item);
      if (item?.children?.length === 0) {
        if (item.name === 'Bundled Products') {
          navigation.navigate('BundledProductsListScreen', {
            nodeId: item?.nodeId,
            title: item?.name,
          });
        } else {
          navigation.navigate('ProductsListScreen', {
            nodeId: item?.nodeId,
            title: item?.name,
          });
        }
      } else {
        handleItemPress(item.nodeId);
      }
    };

    return (
      <Box>
        <TouchableOpacity
          style={styles.item}
          onPress={onPressHeader}
          activeOpacity={0.8}>
          <View style={styles.itemContainer}>
            <Text style={styles.itemText}>
              {item.name}{' '}
              {item?.children?.length !== 0 ? (
                <>
                  <Text>({item?.children?.length})</Text>
                </>
              ) : (
                <></>
              )}
            </Text>
            <Text>{expandedItem === item.nodeId ? '-' : '+'}</Text>
          </View>

          {expandedItem === item.nodeId && (
            <>
              <Animated.View style={[styles.expandedView, {expandStyle}]}>
                <FlatList
                  data={item?.children}
                  renderItem={renderSubCategory}
                  keyExtractor={item => item.nodeId.toString()}
                  scrollEnabled={false}
                />
              </Animated.View>
            </>
          )}
        </TouchableOpacity>
      </Box>
    );
  };

  return (
    <Box flex={1} paddingHorizontal="paddingHorizontal">
      <FlatList
        data={categoriesData}
        renderItem={renderCategory}
        // keyExtractor={item => item.nodeId.toString()}
        contentContainerStyle={styles.flatListContainer}
        ListEmptyComponent={
          isLoading ? (
            <ActivityIndicator color={theme.colors.sushiittoRed} />
          ) : (
            <Text>EMPTY LIST</Text>
          )
        }
      />
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('ConfiguredBundleScreen');
        }}>
        <Text> Configurable Bundle</Text>
      </TouchableOpacity>

      {/* {!isLoading ? (
        <>
          <FlatList
            data={categoriesData}
            renderItem={renderCategory}
            keyExtractor={item => item.nodeId.toString()}
            contentContainerStyle={styles.flatListContainer}
            ListEmptyComponent={<ActivityIndicator />}
          />
        </>
      ) : (
        <>
          <ActivityIndicator />
        </>
      )} */}
    </Box>
  );
};

const styles = StyleSheet.create({
  flatListContainer: {
    flexGrow: 1,
  },
  item: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  itemContainer: {justifyContent: 'space-between', flexDirection: 'row'},
  itemText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  expandedView: {
    marginTop: 12,
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
  },
  expandedText: {
    fontSize: 14,
    color: '#000',
    fontWeight: '600',
  },
  subCategoryItem: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginVertical: 8,
    padding: 8,
    backgroundColor: '#ffffff',
    borderRadius: 8,
  },
});

export default CategorySection;
