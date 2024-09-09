import React, { useRef } from 'react';
import { View, Image, PanResponder, Animated } from 'react-native';
import { images } from '../constants';

const LogoFlipWithBubble = () => {
  const rotateX = useRef(new Animated.Value(0)).current;
  const rotateY = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gestureState) => {
        const { dx, dy } = gestureState;
        rotateY.setValue(dx);
        rotateX.setValue(dy);
      },
      onPanResponderRelease: () => {
        Animated.parallel([
          Animated.spring(rotateY, {
            toValue: 0,
            useNativeDriver: false,
          }),
          Animated.spring(rotateX, {
            toValue: 0,
            useNativeDriver: false,
          }),
        ]).start();
      },
    })
  ).current;

  const rotateXInterpolate = rotateX.interpolate({
    inputRange: [-200, 200],
    outputRange: ['-45deg', '45deg'],
  });

  const rotateYInterpolate = rotateY.interpolate({
    inputRange: [-200, 200],
    outputRange: ['-45deg', '45deg'],
  });

  const shadowOpacity = rotateX.interpolate({
    inputRange: [-200, 0, 200],
    outputRange: [0.8, 0, 0.8],
    extrapolate: 'clamp',
  });

  const shadowTranslateX = rotateY.interpolate({
    inputRange: [-200, 200],
    outputRange: [-30, 30],
    extrapolate: 'clamp',
  });

  const shadowTranslateY = rotateX.interpolate({
    inputRange: [-200, 200],
    outputRange: [-30, 30],
    extrapolate: 'clamp',
  });

  return (
    <View className="w-full max-w-[380px] h-[300px] mt-20" {...panResponder.panHandlers}>
      <View className="absolute top-0 left-0 right-0 bottom-0 justify-center items-center">
        <Animated.View
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            opacity: shadowOpacity,
            transform: [
              { translateX: shadowTranslateX },
              { translateY: shadowTranslateY },
              { perspective: 1000 },
              { rotateX: rotateXInterpolate },
              { rotateY: rotateYInterpolate },
            ],
            borderRadius: 10,
          }}
          className="absolute inset-0 rounded-full"
        />
      </View>
      <Animated.View
        style={{
          transform: [
            { perspective: 1000 },
            { rotateX: rotateXInterpolate },
            { rotateY: rotateYInterpolate },
          ],
          borderRadius: 10,
        }}
        className="w-full h-full relative rounded-lg"
      >
        <Image
          source={images.logo_placeholder}
          className="w-full h-full rounded-lg"
          resizeMode="contain"
        />
      </Animated.View>
    </View>
  );
};

export default LogoFlipWithBubble;
