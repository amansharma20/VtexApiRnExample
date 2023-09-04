/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useRef, useState} from 'react';
import {Box, Text, theme} from '@atoms';
import {
  Animated,
  Dimensions,
  FlatList,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import FastImage from 'react-native-fast-image';

const ITEM_WIDTH = Dimensions.get('window').width;
const ITEM_HEIGHT = 200;

const ContentFullSection = () => {
  const [blogPageImage, setBlogPageImage] = useState();
  const [cmsData, setCmsData] = useState();
  const [currentIndex, setCurrentIndex] = useState(0);

  const flatListRef = useRef();

  const headerData = cmsData?.items?.[0]?.heroBannerImageCollection?.items;
  const midSectionData = [];

  const handleScroll = event => {
    const {contentOffset} = event.nativeEvent;
    const index = Math.floor(contentOffset.x / ITEM_WIDTH);
    setCurrentIndex(index);
  };

  const renderHeaderItem = ({item}) => {
    return (
      <Box>
        <Box
          marginVertical="s20"
          marginHorizontal="paddingHorizontal"
          backgroundColor="white"
          borderRadius={8}
          // flex={1}
          shadowColor="black"
          shadowOpacity={0.1}
          shadowRadius={10}
          elevation={7}>
          {/* <ImageBackground source={{uri: item.url}} style={styles.itemContainer}>
          <Box flex={1} justifyContent="flex-end" mb="s40">
            <></>
            <Text
              fontSize={28}
              color="white"
              fontWeight="700"
              numberOfLines={2}
              marginHorizontal="s16">
              {item?.description}
            </Text>
          </Box>
        </ImageBackground> */}

          <FastImage
            source={{uri: item.url}}
            style={{
              width: ITEM_WIDTH - 32,
              // height: ITEM_HEIGHT,
              height: ITEM_WIDTH - 32,
              borderRadius: 8,
            }}
            resizeMode="cover"
          />
        </Box>
      </Box>
    );
  };

  const renderMidSectionItem = ({item}) => {
    return (
      <Box>
        <ImageBackground
          source={{uri: item.midSectionImageCollection?.items?.[0]?.url}}
          style={[
            styles.itemContainer,
            {width: ITEM_WIDTH - 32, marginBottom: 12},
          ]}>
          <Box flex={1} backgroundColor="black" opacity={0.25} />
          <Text
            fontSize={24}
            color="white"
            // fontWeight="500"
            variant="bold16"
            position="absolute"
            numberOfLines={2}
            bottom={60}
            left={10}>
            {item?.midSectionDescription}
          </Text>
          <TouchableOpacity
            style={{
              position: 'absolute',
              borderRadius: 20,
              borderWidth: 1,
              borderColor: theme.colors.border,
              paddingHorizontal: 16,
              paddingVertical: 6,
              bottom: 20,
              left: 10,
            }}>
            <Text color="white">{item?.midSectionButtonTitle}</Text>
          </TouchableOpacity>
        </ImageBackground>
      </Box>
    );
  };

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await fetch(
  //         'https://graphql.contentful.com/content/v1/spaces/8m0ovx5oy7z6/environments/master?access_token=y9d3K_fBoCbucpnpi1_tzqtlU8yctBW-ZPpOEscF8i4',

  //         {
  //           method: 'POST',

  //           headers: {
  //             'Content-Type': 'application/json',
  //           },

  //           body: JSON.stringify({
  //             query: `

  //               query blogPageEntryQuery {

  //                 blogPage(id: "5XSN6mWNBfnnh8OZxxtR7q") {

  //                   publishDate

  //                   articleSummary

  //                   articleHeading

  //                   blogLocation {

  //                     lat

  //                     lon

  //                   }

  //                   bannerImagesCollection {

  //                     items {

  //                       url

  //                     }

  //                   }

  //                 }

  //               }

  //             `,
  //           }),
  //         },
  //       );

  //       const data = await response.json();

  //       setBlogPageImage(
  //         data.data.blogPage?.bannerImagesCollection?.items[0].url,
  //       );
  //     } catch (error) {}
  //   };

  //   fetchData();
  // }, []);

  const fetchData = async () => {
    const url =
      'https://graphql.contentful.com/content/v1/spaces/b7hw33ucy3y5/environments/master';
    const query = `{

   sushiittoHomeContentCollection{
    items{
      heroBannerImageCollection{
        items{
          url
        }
      }
    }
  }
    }`;

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer 1bKW_Ovigequ04fW779NKR1inURdE7FPGRKhIFRMyuM',
      },
      body: JSON.stringify({query}),
    };

    try {
      const response = await fetch(url, options);
      const data = await response.json();
      console.log('data: ', data?.data?.sushiittoHomeContentCollection);
      setCmsData(data?.data?.sushiittoHomeContentCollection);
      // setCmsData(data.data);
      // Process the response data as per your requirements
    } catch (error) {
      console.error('API request failed:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Box>
      <Box>
        <Animated.FlatList
          ref={flatListRef}
          data={headerData}
          renderItem={renderHeaderItem}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => item.id}
          scrollEventThrottle={16}
          snapToInterval={ITEM_WIDTH}
          decelerationRate="fast"
          onScroll={handleScroll}
        />
      </Box>
      <Box
        flexDirection="row"
        // position="absolute"
        // bottom={40}
        width={'100%'}
        justifyContent="center"
        mb="s16">
        {headerData?.map((_, index) => (
          <Box
            width={8}
            height={8}
            borderRadius={4}
            backgroundColor={
              index === currentIndex ? 'activeDot' : 'inactiveDot'
            }
            marginHorizontal="s4"
            key={index}
            // style={[
            //   styles.paginationDot,
            //   index === currentIndex && styles.paginationDotActive,
            // ]}
          />
        ))}
      </Box>

      {/* <Box paddingHorizontal="paddingHorizontal" mt="s20" backgroundColor='red'>
        <FlatList
          // ref={flatListRef}
          data={midSectionData}
          renderItem={renderMidSectionItem}
          // horizontal
          // pagingEnabled
          showsHorizontalScrollIndicator={false}
          // keyExtractor={item => item.id}
          // scrollEventThrottle={16}
          // snapToInterval={ITEM_WIDTH}
          // decelerationRate="fast"
          contentContainerStyle={{
            paddingVertical: theme.spacing.s8,
          }}
          // onScroll={handleScroll}
        />
      </Box> */}
    </Box>
  );
};

export default ContentFullSection;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemContainer: {
    width: ITEM_WIDTH,
    height: ITEM_HEIGHT,
    flex: 1,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'white',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: theme.colors.bottomTabActiveColor,
  },
});
