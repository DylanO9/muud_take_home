import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Animated } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';

const moodIcons = {
  1: { name: 'emoticon-cry-outline', color: '#FF6B6B' },
  2: { name: 'emoticon-sad-outline', color: '#FFA07A' },
  3: { name: 'emoticon-neutral-outline', color: '#FFD93D' },
  4: { name: 'emoticon-happy-outline', color: '#98D8AA' },
  5: { name: 'emoticon-excited-outline', color: '#4CAF50' },
};

const JournalHistoryScreen = () => {
  const { journalEntries } = useApp();
  const cloudAnimations = Array(8).fill(0).map(() => new Animated.Value(0));

  useEffect(() => {
    const startCloudAnimation = (animation: Animated.Value, duration: number, delay: number) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(animation, {
            toValue: 1,
            duration: duration,
            useNativeDriver: true,
            delay: delay,
          }),
          Animated.timing(animation, {
            toValue: 0,
            duration: duration,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    cloudAnimations.forEach((animation, index) => {
      startCloudAnimation(animation, 4000 + index * 500, index * 300);
    });
  }, []);

  const renderCloud = (animation: Animated.Value, style: any, scale: number = 1) => {
    return (
      <Animated.View
        style={[
          styles.cloud,
          style,
          {
            transform: [
              {
                translateX: animation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-15, 15],
                }),
              },
              {
                scale: animation.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [scale, scale * 1.05, scale],
                }),
              },
            ],
          },
        ]}
      >
        <View style={styles.cloudPart} />
        <View style={[styles.cloudPart, styles.cloudPart2]} />
        <View style={[styles.cloudPart, styles.cloudPart3]} />
        <View style={[styles.cloudPart, styles.cloudPart4]} />
        <View style={[styles.cloudPart, styles.cloudPart5]} />
      </Animated.View>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderEntry = ({ item }: { item: any }) => (
    <View style={styles.entryCard}>
      <View style={styles.entryHeader}>
        <MaterialCommunityIcons
          name={moodIcons[item.mood_rating as keyof typeof moodIcons].name}
          size={24}
          color={moodIcons[item.mood_rating as keyof typeof moodIcons].color}
        />
        <Text style={styles.dateText}>{formatDate(item.timestamp)}</Text>
      </View>
      <Text style={styles.entryText}>{item.entry_text}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.cloudBackground}>
        {renderCloud(cloudAnimations[0], styles.cloud1, 1)}
        {renderCloud(cloudAnimations[1], styles.cloud2, 0.8)}
        {renderCloud(cloudAnimations[2], styles.cloud3, 1.2)}
        {renderCloud(cloudAnimations[3], styles.cloud4, 0.9)}
        {renderCloud(cloudAnimations[4], styles.cloud5, 0.7)}
        {renderCloud(cloudAnimations[5], styles.cloud6, 1.1)}
        {renderCloud(cloudAnimations[6], styles.cloud7, 0.85)}
        {renderCloud(cloudAnimations[7], styles.cloud8, 0.95)}
      </View>
      <FlatList
        data={journalEntries}
        renderItem={renderEntry}
        keyExtractor={(item) => item.journal_entry_id.toString()}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e8f4ff',
  },
  cloudBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
    zIndex: 0,
  },
  cloud: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cloudPart: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 50,
    position: 'absolute',
    width: 70,
    height: 70,
  },
  cloudPart2: {
    transform: [{ translateX: 25 }],
    width: 60,
    height: 60,
  },
  cloudPart3: {
    transform: [{ translateX: -25 }],
    width: 65,
    height: 65,
  },
  cloudPart4: {
    transform: [{ translateX: 12 }, { translateY: -15 }],
    width: 55,
    height: 55,
  },
  cloudPart5: {
    transform: [{ translateX: -12 }, { translateY: -15 }],
    width: 58,
    height: 58,
  },
  cloud1: { width: 160, height: 90, top: '5%', left: '15%' },
  cloud2: { width: 140, height: 80, top: '20%', left: '55%' },
  cloud3: { width: 180, height: 100, top: '35%', left: '25%' },
  cloud4: { width: 150, height: 85, top: '50%', left: '65%' },
  cloud5: { width: 120, height: 70, top: '65%', left: '35%' },
  cloud6: { width: 170, height: 95, top: '80%', left: '75%' },
  cloud7: { width: 130, height: 75, top: '15%', left: '85%' },
  cloud8: { width: 110, height: 65, top: '90%', left: '45%' },
  listContainer: {
    padding: 20,
    zIndex: 1,
  },
  entryCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  entryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  dateText: {
    fontSize: 16,
    color: '#4a90e2',
    marginLeft: 10,
  },
  entryText: {
    fontSize: 16,
    color: '#4a90e2',
    lineHeight: 24,
  },
});

export default JournalHistoryScreen;