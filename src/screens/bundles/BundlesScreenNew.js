/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import {
  ActivityIndicator,
  Dimensions,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Box, Text, theme} from '@atoms';
import {api} from '../../api/SecureAPI';
import CommonHeader from '../../components/CommonHeader/CommonHeader';
import {FlashList} from '@shopify/flash-list';
import BundleItem from './BundleItem';
import CommonSolidButton from '../../components/CommonSolidButton/CommonSolidButton';
import {useNavigation} from '@react-navigation/native';
import Toast from 'react-native-toast-message';

const BundlesScreenNew = props => {
  const navigation = useNavigation();
  const configurableBundleId = props.route?.params?.configurableBundleId;
  const flatListRef = useRef();

  const [isLoading, setIsLoading] = useState(false);
  console.log('isLoading: ', isLoading);
  const [finalState, setFinalState] = useState([]);
  //   console.log('finalState: ', finalState);
  const [isSelected, setIsSelected] = useState([]);
  const [postBundleData, setPostBundleData] = useState([]);
  const [summaryBundleData, setSummaryBundleData] = useState([]);

  const [currentIndex, setCurrentIndex] = useState(0);

  const postProductSlotsData = {
    data: {
      type: 'configured-bundles',
      attributes: {
        quantity: 1,
        templateUuid: configurableBundleId,
        items: postBundleData,
      },
    },
  };

  const changeIndexPositive = useCallback(() => {
    // if (postBundleData[currentIndex]) {
    setIsSelected(true);
    setCurrentIndex(index => {
      const newIndex = index < finalState.length - 1 ? index + 1 : index;

      const dummyIndex = index + 1;
      if (dummyIndex !== finalState.length) {
        flatListRef.current?.scrollToIndex({
          index: newIndex,
        });
      } else {
        //   submitQuestions();
        console.log('submit');
        // addToCart();
        // handleExpandPress();
        navigation.navigate('BundlesSummaryScreen', {
          summaryBundleData: summaryBundleData,
          configurableBundleId: configurableBundleId,
          postProductSlotsData: postProductSlotsData,
        });
      }
      return newIndex;
    });
    // } else {
    //   Toast.show({
    //     type: 'error',
    //     position: 'top',
    //     text1: 'Please select one.',
    //     text2: '',
    //     visibilityTime: 1000,
    //     autoHide: true,
    //     topOffset: IS_IOS ? getStatusBarHeight() : 30,
    //     bottomOffset: 40,
    //   });
    //   console.log('error');
    // }
  }, [currentIndex, finalState, summaryBundleData]);

  const changeIndexNegative = useCallback(() => {
    setCurrentIndex(index => {
      const newIndex = index - 1;
      flatListRef.current?.scrollToIndex({
        index: newIndex,
      });
      return newIndex;
    });
  }, [currentIndex]);

  const onPressBack = () => {
    if (currentIndex === 0) {
      navigation.goBack();
    } else {
      changeIndexNegative();
    }
  };

  const renderBundleItems = ({item, index}) => {
    console.log(
      'finalState[index]: ',
      finalState[index].slotName,
      index + 1,
      finalState.length,
    );
    return (
      <BundleItem
        title={`${finalState[index]?.slotName} (${index + 1}/${
          finalState.length
        })`}
        BundleData={finalState[index]?.slotData}
        slotID={finalState[index]?.id}
        finalState={finalState}
        index={index}
        selectedOptionsIndex={index}
        isSelected={isSelected}
        setPostBundleData={setPostBundleData}
        postBundleData={postBundleData}
        summaryBundleData={summaryBundleData}
        setSummaryBundleData={setSummaryBundleData}
      />
    );
  };

  // const url = `https://newconfigure-5g04sc.5sc6y6-3.usa-e2.cloudhub.io/configurable-bundle-templates?bundleId=${configurableBundleId}`;
  const url = `https://sushiitobff-dzt0m3.5sc6y6-2.usa-e2.cloudhub.io/configurable-bundle-templates?bundleId=${configurableBundleId}`;
  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      const response = await api.getWithUrl(url);
      if (response.data.status === 200) {
        // console.log('response.data: ', response.data.data);
        setFinalState(response.data.data);
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <CommonHeader title={'Create your rolls'} onPress={onPressBack} />
      {finalState && finalState?.length > 0 ? (
        <>
          <Box
            flex={1}
            backgroundColor="white"
            // paddingHorizontal="paddingHorizontal"
          >
            <FlashList
              data={finalState}
              renderItem={renderBundleItems}
              estimatedItemSize={100}
              showsVerticalScrollIndicator={false}
              horizontal
              showsHorizontalScrollIndicator={false}
              // scrollEnabled={false}
              bounces={false}
              ref={ref => (flatListRef.current = ref)}
              onScrollToIndexFailed={() => {
                setTimeout(() => {
                  if (flatListRef) {
                    flatListRef?.current?.scrollToIndex({
                      index: 1,
                      animated: true,
                    });
                  }
                }, 100);
              }}
              estimatedListSize={{
                height: Dimensions.get('window').height,
                width: Dimensions.get('screen').width,
              }}
              scrollEnabled={false}
            />
          </Box>
        </>
      ) : (
        <>
          <ActivityIndicator color={theme.colors.sushiittoRed} />
        </>
      )}

      {finalState && finalState?.length > 0 ? (
        <>
          {currentIndex + 1 === finalState.length ? (
            <>
              <Box paddingHorizontal="paddingHorizontal" paddingVertical="s16">
                <CommonSolidButton
                  title={'Show Summary'}
                  onPress={changeIndexPositive}
                  disabled={postBundleData.length === 0 ? true : false}
                  disabledOnPress={() => {
                    Toast.show({
                      type: 'info',
                      text1: 'Please select atleast one Bundle.',
                      position: 'bottom',
                    });
                  }}
                />
              </Box>
            </>
          ) : (
            <>
              <Box
                padding="s16"
                backgroundColor="white"
                style={theme.cardVariants.bottomButtonShadow}>
                <CommonSolidButton
                  title={'Continue'}
                  onPress={changeIndexPositive}
                />
              </Box>
            </>
          )}
        </>
      ) : (
        <></>
      )}
    </SafeAreaView>
  );
};

export default BundlesScreenNew;

const styles = StyleSheet.create({});
