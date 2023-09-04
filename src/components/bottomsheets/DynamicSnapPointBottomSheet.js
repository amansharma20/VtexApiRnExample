/* eslint-disable react-hooks/exhaustive-deps */
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
  BottomSheetView,
  useBottomSheetDynamicSnapPoints,
} from '@gorhom/bottom-sheet';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Easing} from 'react-native-reanimated';
import {BackHandler} from 'react-native';
import {theme} from '@atoms';
import {IS_IOS} from '../../utils/appUtils';

const DynamicSnapPointBottomSheet = ({
  children,
  bottomSheetRef,
  bottomTabPadding,
  hideHandle,
  disablePanDownToClose,
  disableBackdropPressBehavior,
  disableBackAction,
  isScrollView,
}) => {
  const insets = useSafeAreaInsets();

  const initialSnapPoints = useMemo(
    () => ['CONTENT_HEIGHT', 'CONTENT_HEIGHT'],
    [],
  );

  const {
    animatedHandleHeight,
    animatedSnapPoints,
    animatedContentHeight,
    handleContentLayout,
  } = useBottomSheetDynamicSnapPoints(initialSnapPoints);

  const [bottomSheetIndex, setBottomSheetIndex] = useState(-1);

  const handleSheetChanges = useCallback(index => {
    setBottomSheetIndex(index);
  }, []);

  const renderBackdrop = useCallback(
    props => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        pressBehavior={disableBackdropPressBehavior ? 'none' : 'close'}
      />
    ),
    [],
  );

  const handleStyle = hideHandle
    ? {
        backgroundColor: theme.colors.red,
        borderRadius: 8,
        height: 0,
        padding: 0,
      }
    : {};

  const handleIndicatorStyle = hideHandle
    ? {
        backgroundColor: theme.colors.background,
        height: 0,
      }
    : {};

  const bottomSheetViewStyle = {
    paddingBottom: bottomTabPadding
      ? 75
      : IS_IOS
      ? insets.bottom === 0
        ? 16
        : insets.bottom
      : 16,
  };

  useEffect(() => {
    if (disableBackAction) {
      const backAction = () => {
        if (bottomSheetIndex === 1) {
          return true;
        } else {
          return false;
        }
      };

      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction,
      );

      return () => backHandler.remove();
    }
  }, [bottomSheetIndex]);

  const renderView = () => {
    if (isScrollView) {
      return (
        <BottomSheetScrollView onLayout={handleContentLayout}>
          {children}
        </BottomSheetScrollView>
      );
    }
    return (
      <BottomSheetView
        onLayout={handleContentLayout}
        style={bottomSheetViewStyle}>
        {children}
      </BottomSheetView>
    );
  };

  return (
    <BottomSheet
      ref={bottomSheetRef}
      snapPoints={animatedSnapPoints}
      index={-1}
      enablePanDownToClose={disablePanDownToClose ? false : true}
      handleHeight={animatedHandleHeight}
      contentHeight={animatedContentHeight}
      backdropComponent={renderBackdrop}
      handleStyle={handleStyle}
      handleIndicatorStyle={handleIndicatorStyle}
      animationDuration={500}
      animationEasing={Easing.out(Easing.quad)}
      onChange={handleSheetChanges}>
      {/* <BottomSheetView
        onLayout={handleContentLayout}
        style={bottomSheetViewStyle}
      >
        {children}
      </BottomSheetView> */}
      {renderView()}
    </BottomSheet>
  );
};

export default DynamicSnapPointBottomSheet;
