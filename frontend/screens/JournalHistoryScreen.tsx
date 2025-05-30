import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Animated } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Mock data types
interface JournalEntry {
  id: number;
  user_id: number;
  entry_text: string;
  mood_rating: number;
  timestamp: string;
}

const moodIcons: Record<number, { name: keyof typeof MaterialCommunityIcons.glyphMap; color: string }> = {
  1: { name: 'emoticon-cry-outline', color: '#4a90e2' },
  2: { name: 'emoticon-sad-outline', color: '#5c9ce6' },
  3: { name: 'emoticon-neutral-outline', color: '#6ea7ea' },
  4: { name: 'emoticon-happy-outline', color: '#80b2ee' },
  5: { name: 'emoticon-excited-outline', color: '#92bdf2' }
};

// Mock data
const mockEntries: JournalEntry[] = [
  {
    id: 1,
    user_id: 1,
    entry_text: "Today was a productive day. I completed all my tasks and felt accomplished.",
    mood_rating: 4,
    timestamp: "2024-03-20T10:00:00Z"
  },
  {
    id: 2,
    user_id: 1,
    entry_text: "Feeling a bit overwhelmed with work, but trying to stay positive.",
    mood_rating: 3,
    timestamp: "2024-03-19T15:30:00Z"
  },
  {
    id: 3,
    user_id: 1,
    entry_text: "Had a great conversation with a friend today. It really lifted my spirits.",
    mood_rating: 5,
    timestamp: "2024-03-18T20:15:00Z"
  }
];

const JournalHistoryScreen = () => {
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
      </Animated.View>
    );
  };

  const renderEntry = ({ item }: { item: JournalEntry }) => {
    const date = new Date(item.timestamp);
    const formattedDate = date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    return (
      <View style={styles.entryCard}>
        <View style={styles.entryHeader}>
          <Text style={styles.dateText}>{formattedDate}</Text>
          <View style={styles.moodContainer}>
            <MaterialCommunityIcons
              name={moodIcons[item.mood_rating].name}
              size={24}
              color={moodIcons[item.mood_rating].color}
            />
            <Text style={[styles.moodNumber, { color: moodIcons[item.mood_rating].color }]}>
              {item.mood_rating}
            </Text>
          </View>
        </View>
        <Text style={styles.entryText}>{item.entry_text}</Text>
      </View>
    );
  };

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

      <View style={styles.contentContainer}>
        <FlatList
          data={mockEntries}
          renderItem={renderEntry}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
        />
      </View>
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
    zIndex: 1,
  },
  cloud: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cloudPart: {
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderRadius: 50,
    position: 'absolute',
    width: 60,
    height: 60,
  },
  cloudPart2: {
    transform: [{ translateX: 20 }],
    width: 50,
    height: 50,
  },
  cloudPart3: {
    transform: [{ translateX: -20 }],
    width: 55,
    height: 55,
  },
  cloud1: {
    width: 140,
    height: 80,
    top: '5%',
    left: '15%',
  },
  cloud2: {
    width: 120,
    height: 70,
    top: '20%',
    left: '55%',
  },
  cloud3: {
    width: 160,
    height: 90,
    top: '35%',
    left: '25%',
  },
  cloud4: {
    width: 130,
    height: 75,
    top: '50%',
    left: '65%',
  },
  cloud5: {
    width: 100,
    height: 60,
    top: '65%',
    left: '35%',
  },
  cloud6: {
    width: 150,
    height: 85,
    top: '80%',
    left: '75%',
  },
  cloud7: {
    width: 110,
    height: 65,
    top: '15%',
    left: '85%',
  },
  cloud8: {
    width: 90,
    height: 55,
    top: '90%',
    left: '45%',
  },
  contentContainer: {
    flex: 1,
    padding: 20,
    zIndex: 2,
  },
  listContainer: {
    paddingBottom: 20,
  },
  entryCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
    elevation: 5,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  dateText: {
    fontSize: 16,
    color: '#4a90e2',
    fontWeight: '500',
  },
  moodContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    padding: 8,
    borderRadius: 15,
  },
  moodNumber: {
    marginLeft: 5,
    fontSize: 14,
    fontWeight: 'bold',
  },
  entryText: {
    fontSize: 16,
    color: '#4a90e2',
    lineHeight: 24,
  },
});

export default JournalHistoryScreen;