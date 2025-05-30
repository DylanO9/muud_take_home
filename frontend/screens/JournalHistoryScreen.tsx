import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Animated, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Types
interface JournalEntry {
  journal_entry_id: number;
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

const JournalHistoryScreen = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const cloudAnimations = Array(8).fill(0).map(() => new Animated.Value(0));

  useEffect(() => {
    fetchJournalEntries();
  }, []);

  const fetchJournalEntries = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const userDataString = await AsyncStorage.getItem('userData');
      if (!userDataString) {
        throw new Error('No user data found');
      }
      const userData = JSON.parse(userDataString);
      const user_id = userData.user_id;

      const response = await fetch(`https://muud-take-home.onrender.com/journal/user/${user_id}`, {
        headers: {
          'Authorization': `BEARER ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch journal entries');
      }

      const data = await response.json();
      setEntries(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

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
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4a90e2" />
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={fetchJournalEntries}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={entries}
            renderItem={renderEntry}
            keyExtractor={(item) => item.journal_entry_id.toString()}
            contentContainerStyle={styles.listContainer}
            refreshing={loading}
            onRefresh={fetchJournalEntries}
          />
        )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#4a90e2',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default JournalHistoryScreen;