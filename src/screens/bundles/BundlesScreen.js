/* eslint-disable new-parens */
/* eslint-disable no-new */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Box, theme} from '@atoms';
import {ActivityIndicator, Dimensions} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import BundleItem from './BundleItem';
import {commonApi} from '../../api/CommanAPI';
import {FlashList} from '@shopify/flash-list';
import CommonHeader from '../../components/CommonHeader/CommonHeader';
import CommonSolidButton from '../../components/CommonSolidButton/CommonSolidButton';
import Toast from 'react-native-toast-message';

const BundlesScreen = props => {
  const configurableBundleId = props.route?.params?.configurableBundleId;

  const flatListRef = useRef();
  const navigation = useNavigation();

  const [postBundleData, setPostBundleData] = useState([]);
  const [summaryBundleData, setSummaryBundleData] = useState([]);

  const [finalState, setFinalState] = useState([]);

  const [currentIndex, setCurrentIndex] = useState(0);

  const [isSelected, setIsSelected] = useState([]);

  const bottomSheetRef = useRef(null);

  const handleExpandPress = useCallback(() => {
    bottomSheetRef.current?.expand();
  }, []);
  const handleClosePress = useCallback(() => {
    bottomSheetRef.current?.close();
  }, []);

  // console.log('finalState[index]?.slotID: ', finalState[1]?.slotID);
  const renderBundleItems = ({item, index}) => {
    return (
      <BundleItem
        title={finalState[index]?.slotName}
        BundleData={finalState[index]?.productSKUS}
        slotID={finalState[index]?.slotID}
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

  // SLOTS

  // const configurableBundleId = `8d8510d8-59fe-5289-8a65-19f0c35a0089`;
  const [isLoading, setIsLoading] = useState(false);
  const [configuredBundleTemplateSlots, setConfiguredBundleTemplateSlots] =
    useState([]);

  const refractorData = () => {
    const allProductsWithSlots = [];

    const slotIds =
      configuredBundleTemplateSlots?.data?.relationships[
        'configurable-bundle-template-slots'
      ]?.data;
    if (!slotIds || slotIds.length === 0) {
      return allProductsWithSlots;
    }

    configuredBundleTemplateSlots.included.forEach(element => {
      if (
        element.type === 'configurable-bundle-template-slots' &&
        slotIds.some(slot => slot.id === element.id)
      ) {
        const productSKUS = element.relationships['concrete-products']?.data;
        const slotName = element.attributes.name;

        allProductsWithSlots.push({
          slotID: element.id,
          productSKUS,
          slotName,
        });
      }
    });

    allProductsWithSlots.forEach(products => {
      products.productSKUS?.forEach(item => {
        configuredBundleTemplateSlots.included.forEach(includedItem => {
          if (item?.id === includedItem.id) {
            if (includedItem.type === 'concrete-product-image-sets') {
              const externalUrlLarge =
                includedItem.attributes.imageSets[0]?.images[0]
                  ?.externalUrlLarge;
              item.image = externalUrlLarge;
            } else if (includedItem.type === 'concrete-product-prices') {
              const price = includedItem.attributes.price;
              item.price = price;
            } else if (includedItem.type === 'concrete-products') {
              const name = includedItem.attributes.name;
              item.name = name;
            }
          }
        });
      });
    });

    return allProductsWithSlots;
  };
  useEffect(() => {
    const getConfiguredBundleSlotsByID = async configurableBundleId => {
      setIsLoading(true);
      const response = await commonApi.get(
        `configurable-bundle-templates/${configurableBundleId}?include=configurable-bundle-template-slots%2Cconcrete-products%2Cconcrete-product-image-sets%2Cconcrete-product-prices`,
      );
      setConfiguredBundleTemplateSlots(response?.data?.data);

      setIsLoading(false);
    };
    getConfiguredBundleSlotsByID(configurableBundleId);
  }, []);

  const result = refractorData();
  const [stateSetted, setStateSetted] = useState(false);

  useEffect(() => {
    if (result.length > 0 && stateSetted === false) {
      setFinalState(result);
      setStateSetted(true);
    }
  }, [result]);

  return (
    <Box flex={1} backgroundColor="white">
      <CommonHeader title={'Configurable Bundle'} onPress={onPressBack} />
      {/* <Button title="changeIndexPositive" onPress={changeIndexPositive} />
      <Button title="changeIndexNegative" onPress={onPressBack} /> */}

      <Box flex={1}>
        {finalState && finalState?.length > 0 ? (
          <Box flex={1}>
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
        ) : (
          <>
            <ActivityIndicator color={theme.colors.sushiittoRed} />
          </>
        )}
      </Box>
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
              <Box paddingHorizontal="paddingHorizontal" paddingVertical="s16">
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
    </Box>
  );
};

export default BundlesScreen;
