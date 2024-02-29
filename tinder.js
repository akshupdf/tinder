import React, { useState } from 'react';
import { View, Animated, PanResponder, Dimensions, StyleSheet, Text, TouchableOpacity } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;

const TinderSwipe = () => {
  const [pan] = useState(new Animated.ValueXY());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cards] = useState([
    { id: 1, backgroundColor: '#FF6347', text: 'Swipe left to X' },
    { id: 2, backgroundColor: '#32CD32', text: 'Swipe right to ✓' },
    { id: 3, backgroundColor: '#4169E1', text: 'Another card' },
  ]);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], { useNativeDriver: false }),
    onPanResponderRelease: (e, gesture) => {
      if (gesture.dx > 120) {
        handleSwipe('right');
      } else if (gesture.dx < -120) {
        handleSwipe('left');
      } else {
        Animated.spring(pan, { toValue: { x: 0, y: 0 }, useNativeDriver: false }).start();
      }
    },
  });

  const handleSwipe = (direction) => {
    if (currentIndex + 1 >= cards.length) {
      // No more cards left
      console.log('No more data');
      return;
    }

    setCurrentIndex(currentIndex + 1);
    Animated.spring(pan, { toValue: { x: 0, y: 0 }, useNativeDriver: false }).start();
  };

  const resetData = () => {
    setCurrentIndex(0);
    Animated.spring(pan, { toValue: { x: 0, y: 0 }, useNativeDriver: false }).start();
  };

  const rotateCard = pan.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: ['-10deg', '0deg', '10deg'],
    extrapolate: 'clamp',
  });

  const animatedStyle = {
    transform: [{ translateX: pan.x }, { translateY: pan.y }, { rotate: rotateCard }],
  };

  const renderCardContent = () => {
    if (currentIndex >= cards.length) {
      return <Text style={styles.noMoreDataText}>No more data</Text>;
    }

    return (
      <Animated.View
        {...panResponder.panHandlers}
        style={[styles.cardContainer, animatedStyle]}
      >
        <View style={[styles.card, { backgroundColor: cards[currentIndex].backgroundColor }]}>
          <Text style={styles.cardText}>{cards[currentIndex].text}</Text>
        </View>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      {renderCardContent()}
      {currentIndex >= cards.length && (
        <TouchableOpacity onPress={resetData} style={styles.reloadButton}>
          <Text >Reload</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContainer: {
    width: SCREEN_WIDTH - 40,
    height: 300,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  card: {
    flex: 1,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardText: {
    fontSize: 24,
    color: '#fff',
  },
  noMoreDataText: {
    fontSize: 24,
    color: '#000',
  },
  reloadButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#4CAF50',
    borderRadius: 5,
  },
  reloadButtonText: {
    fontSize: 18,
    color: '#fff',
  },
});

export default TinderSwipe;
