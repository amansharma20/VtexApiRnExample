/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect} from 'react';
import {View, StyleSheet, FlatList, ActivityIndicator} from 'react-native';
import ProductItem from '../../components/ProductItem';
import CommonHeader from '../../components/CommonHeader/CommonHeader';
import {theme} from '../../atoms/theme';
import {applicationProperties} from '../../utils/application.properties';
const ProductListScreen = props => {
  const {nodeId, title} = props.route.params;
  const [products, setProducts] = useState([]);
  // const [currentPage, setCurrentPage] = useState(1);
  // const [lastPage, setLastPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [pageOffset, setPageOffset] = useState(0);

  const [includedData, setIncludedData] = useState([]);

  const getProducts = async () => {
    setIsLoading(true);
    const resp = await fetch(
      `${applicationProperties.baseUrl}catalog-search?category=${nodeId}&page[offset]=${pageOffset}&page[limit]=12&include=abstract-products%2Cconcrete-products%2F`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      },
    );
    const result = await resp.json();

    setProducts([
      ...products,
      ...result?.data[0]?.attributes?.abstractProducts,
    ]);
    setIncludedData(result.included);
    setPageOffset(pageOffset + 12);
    setIsLoading(false);
    // setLastPage(result?.data[0]?.attributes?.pagination.maxPage);
    // setCurrentPage(result?.data[0]?.attributes?.pagination.currentPage);
  };

  useEffect(() => {
    if (nodeId) {
      getProducts();
    }
  }, [nodeId]);

  // const loadMore = () => {
  //   if (currentPage <= lastPage) {
  //     getProducts();
  //   }
  // };

  const renderItem = ({item, index}) => (
    <>
      <ProductItem item={item} includedData={includedData} index={index} />
    </>
  );

  return (
    <View style={styles.container}>
      <CommonHeader title={title || 'All Products'} showCartIcon />

      {!isLoading && nodeId ? (
        <>
          <FlatList
            data={products}
            renderItem={renderItem}
            numColumns={2}
            contentContainerStyle={styles.productList}
          />
        </>
      ) : (
        <>
          <ActivityIndicator color={theme.colors.sushiittoRed} />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    // padding: 16,
  },

  productList: {
    // justifyContent: 'space-between',
    paddingHorizontal: 16,
  },

  row: {
    display: 'flex',
    flexDirection: 'row',
  },
});

export default ProductListScreen;
