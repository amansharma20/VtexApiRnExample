import React, {useState} from 'react';
import {View, TextInput, StyleSheet, FlatList} from 'react-native';
import ProductItem from '../../components/ProductItem';
import {SearchIcon} from '../../assets/svgs';
import {applicationProperties} from '../../utils/application.properties';
import {Box} from '@atoms';
import CommonHeader from '../../components/CommonHeader/CommonHeader';

const SearchScreen = () => {
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async () => {
    const resp = await fetch(
      `${applicationProperties.baseUrl}catalog-search-suggestions?q=${searchText}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      },
    );
    const result = await resp.json();
    setSearchResults(result?.data[0]?.attributes?.abstractProducts);
  };

  const renderProductItem = ({item}) => {
    console.log('item: ', item);
    return (
      <>
        <ProductItem item={item} />
      </>
    );
  };

  return (
    <Box flex={1} backgroundColor="white">
      <Box paddingTop="s8" backgroundColor="white">
        <CommonHeader title={'Search'} />
      </Box>
      <Box paddingHorizontal="s16">
        <Box
          flexDirection="row"
          alignItems="center"
          backgroundColor="white"
          borderRadius={10}
          mb="s16"
          shadowColor="black"
          shadowOpacity={0.1}
          shadowRadius={5}
          elevation={3}
          paddingHorizontal="s10">
          <SearchIcon />
          <TextInput
            style={styles.input}
            placeholder="Search for Products, Brands and More"
            value={searchText}
            onChangeText={setSearchText}
            onChange={handleSearch}
            autoFocus={true}
          />
        </Box>
        {searchResults.length > 0 && (
          <FlatList
            data={searchResults}
            renderItem={renderProductItem}
            keyExtractor={item => item.abstractSku}
            numColumns={2}
            contentContainerStyle={styles.productList}
          />
        )}
      </Box>
    </Box>
  );
};

const styles = StyleSheet.create({
  searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  input: {
    flex: 1,
    height: 40,
    paddingLeft: 4,
    color: '#333',
  },
  resultsContainer: {
    marginTop: 16,
  },
  productList: {
    justifyContent: 'space-between',
  },
});

export default SearchScreen;
