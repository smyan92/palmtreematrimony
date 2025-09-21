// app/splash.tsx
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Animated,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';

const { height, width: screenWidth } = Dimensions.get('window');

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export default function SplashScreen() {
  const router = useRouter();

  const [showGoButton, setShowGoButton] = useState(false);

  // Animation values
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(1)).current;
  const logoTranslateY = useRef(new Animated.Value(0)).current;
  const secondImageTranslateY = useRef(new Animated.Value(height)).current;
  const goButtonOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Step 1: Fade in logo
    Animated.timing(logoOpacity, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    // Step 2: Scale down logo, move up, bring in second image
    const animationTimeout = setTimeout(() => {
      Animated.parallel([
        Animated.timing(logoScale, {
          toValue: 0.7,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(logoTranslateY, {
          toValue: -height / 2.5, // Move logo near top
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(secondImageTranslateY, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // After animations finish, show the Go button with fade in
        setShowGoButton(true);
        Animated.timing(goButtonOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start();
      });
    }, 2000);

    return () => clearTimeout(animationTimeout);
  }, []);

  const handleGo = () => {
    router.replace('/(tabs)');
  };

  return (
    <View style={styles.container}>
      {/* Second Image (background-ish) */}
      <Animated.Image
        source={require('../assets/images/couples.png')}
        style={[
          styles.secondImage,
          {
            transform: [{ translateY: secondImageTranslateY }],
          },
        ]}
        resizeMode="contain"
      />

      {/* Main Logo (should be on top) */}
      <Animated.Image
        source={require('../assets/images/logo.png')}
        style={[
          styles.logo,
          {
            opacity: logoOpacity,
            transform: [
              { scale: logoScale },
              { translateY: logoTranslateY },
            ],
          },
        ]}
        resizeMode="contain"
      />

      {/* "Go" Button */}
      {showGoButton && (
        <AnimatedTouchableOpacity
          style={[styles.goButton, { opacity: goButtonOpacity }]}
          onPress={handleGo}
          activeOpacity={0.8}
        >
          <Animated.Text style={styles.goButtonText}>GO</Animated.Text>
        </AnimatedTouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
    backgroundColor: '#F3F3F4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: '80%',
    height: undefined,
    aspectRatio: 1,
    zIndex: 2,
  },
  secondImage: {
    width: screenWidth,
    position: 'absolute',
    bottom: 0,
    zIndex: 1,
  },
  goButton: {
    position: 'absolute',
    bottom: 110,
    backgroundColor: '#FF6A00',
    borderRadius: 30,
    paddingHorizontal: 32,
    paddingVertical: 16,
    zIndex: 9999,
    elevation: 10,
    shadowColor: '#B34700',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    alignSelf: 'center',
  },
  goButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
