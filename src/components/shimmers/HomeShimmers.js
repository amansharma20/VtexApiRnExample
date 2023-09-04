import React from 'react';
import {View, Animated, StyleSheet, Text} from 'react-native';
import {useWindowDimensions} from 'react-native';
import {Box} from '@atoms';

const HomeShimmers = ({duration = 1250}) => {
  const {width} = useWindowDimensions();
  const shimmerValue = new Animated.Value(-width);
  const items = Array.from({length: 5}, (_, index) => `Item ${index + 1}`);

  const startAnimation = () => {
    Animated.loop(
      Animated.timing(shimmerValue, {
        toValue: width,
        duration: duration,
        useNativeDriver: true,
      }),
    ).start();
  };

  React.useEffect(() => {
    startAnimation();
  }, [items]);

  return (
    <Box backgroundColor="white" flex={1}>
      <Box
        marginHorizontal="s16"
        backgroundColor="border"
        overflow="hidden"
        flex={1}
        borderRadius={16}
        mt="s16"
        minHeight={80}
        maxHeight={80}
        mb='s16'>
        <Animated.View
          style={[
            styles.shimmer,
            {
              transform: [
                {
                  translateX: shimmerValue,
                },
              ],
            },
          ]}
        />
      </Box>

      <Box
        marginHorizontal="s16"
        backgroundColor="border"
        overflow="hidden"
        flex={1}
        borderRadius={16}
        minHeight={400}
        maxHeight={400}>
        <Animated.View
          style={[
            styles.shimmer,
            {
              transform: [
                {
                  translateX: shimmerValue,
                },
              ],
            },
          ]}
        />
      </Box>

      {items.map((item, index) => (
        <Box
          marginHorizontal="s16"
          backgroundColor="border"
          overflow="hidden"
          flex={1}
          borderRadius={16}
          mt="s16"
          minHeight={100}
          maxHeight={100}>
          <Animated.View
            style={[
              styles.shimmer,
              {
                transform: [
                  {
                    translateX: shimmerValue,
                  },
                ],
              },
            ]}
          />
        </Box>
      ))}
    </Box>
  );
};

const styles = StyleSheet.create({
  shimmer: {
    backgroundColor: '#ebebeb', // Set this to the shimmer color you desire
    height: '100%',
    width: '50%', // Adjust the width of the shimmer as per your needs
    marginHorizontal: 16,
  },
});

export default HomeShimmers;
