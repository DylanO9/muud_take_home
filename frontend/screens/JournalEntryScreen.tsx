import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Animated,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

type IconName = 'emoticon-cry-outline' | 'emoticon-sad-outline' | 'emoticon-neutral-outline' | 'emoticon-happy-outline' | 'emoticon-excited-outline';

const JournalEntryScreen = () => {
  const { addJournalEntry } = useApp();
  const [entryText, setEntryText] = useState('');
  const [moodRating, setMoodRating] = useState(3);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const cloudAnimations = Array(8).fill(0).map(() => new Animated.Value(0));

  React.useEffect(() => {
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

  const handleSubmit = async () => {
    if (!entryText.trim()) {
      Alert.alert('Error', 'Please enter some text for your journal entry');
      return;
    }

    setIsSubmitting(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('https://muud-take-home.onrender.com/journal/entry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `BEARER ${token}`
        },
        body: JSON.stringify({
          entry_text: entryText,
          mood_rating: moodRating,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create journal entry');
      }

      const data = await response.json();
      
      // Add the new entry to the context
      addJournalEntry({
        journal_entry_id: data.journal_entry_id,
        user_id: parseInt(await AsyncStorage.getItem('userData') || '0'),
        entry_text: entryText,
        mood_rating: moodRating,
        timestamp: new Date().toISOString(),
      });
      
      // Clear form
      setEntryText('');
      setMoodRating(3);
      Keyboard.dismiss();
      
      Alert.alert('Success', 'Your journal entry has been saved!');
    } catch (error) {
      console.error('Error saving entry:', error);
      Alert.alert('Error', 'Failed to save your journal entry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const moodIcons: Record<number, { name: IconName; color: string }> = {
    1: { name: 'emoticon-cry-outline', color: '#FF6B6B' },
    2: { name: 'emoticon-sad-outline', color: '#FFA07A' },
    3: { name: 'emoticon-neutral-outline', color: '#FFD93D' },
    4: { name: 'emoticon-happy-outline', color: '#98D8AA' },
    5: { name: 'emoticon-excited-outline', color: '#4CAF50' },
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
          <View style={styles.journalCard}>
            <TextInput
              style={styles.input}
              placeholder="Write here..."
              value={entryText}
              onChangeText={setEntryText}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              placeholderTextColor="#4a90e2"
              returnKeyType="done"
              onSubmitEditing={Keyboard.dismiss}
              blurOnSubmit={true}
            />

            <View style={styles.moodSection}>
              <Text style={styles.moodLabel}>How are you feeling today?</Text>
              <View style={styles.moodContainer}>
                {[1, 2, 3, 4, 5].map((rating) => (
                  <TouchableOpacity
                    key={rating}
                    style={[
                      styles.moodButton,
                      moodRating === rating && styles.selectedMood,
                    ]}
                    onPress={() => setMoodRating(rating)}
                  >
                    <MaterialCommunityIcons
                      name={moodIcons[rating].name}
                      size={24}
                      color={moodIcons[rating].color}
                    />
                    <Text style={[
                      styles.moodNumber,
                      { color: moodIcons[rating].color }
                    ]}>
                      {rating}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TouchableOpacity
              style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              <View style={styles.submitButtonInner}>
                <Text style={styles.submitButtonText}>
                  {isSubmitting ? 'Saving...' : 'Save Entry'}
                </Text>
                <MaterialCommunityIcons
                  name="cloud-upload"
                  size={20}
                  color="#fff"
                  style={styles.submitIcon}
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
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
    height: 400,
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
  cloud1: { width: 160, height: 90, top: 40, left: '15%' },
  cloud2: { width: 140, height: 80, top: 100, left: '55%' },
  cloud3: { width: 180, height: 100, top: 160, left: '25%' },
  cloud4: { width: 150, height: 85, top: 220, left: '65%' },
  cloud5: { width: 120, height: 70, top: 280, left: '35%' },
  cloud6: { width: 170, height: 95, top: 50, left: '75%' },
  cloud7: { width: 130, height: 75, top: 180, left: '85%' },
  cloud8: { width: 110, height: 65, top: 320, left: '45%' },
  contentContainer: {
    flex: 1,
    padding: 20,
    paddingTop: 150,
    zIndex: 1,
  },
  journalCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  input: {
    flex: 1,
    borderWidth: 0,
    padding: 15,
    fontSize: 18,
    lineHeight: 24,
    color: '#4a90e2',
    textAlignVertical: 'top',
    backgroundColor: 'transparent',
  },
  moodSection: {
    marginVertical: 20,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    padding: 15,
    borderRadius: 15,
  },
  moodLabel: {
    fontSize: 18,
    color: '#4a90e2',
    marginBottom: 15,
    fontWeight: '500',
  },
  moodContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
  moodButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(240, 247, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(225, 238, 255, 0.8)',
  },
  selectedMood: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderColor: '#4a90e2',
    transform: [{ scale: 1.1 }],
  },
  moodNumber: {
    fontSize: 12,
    marginTop: 2,
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: 'rgba(74, 144, 226, 0.9)',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  submitButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  submitIcon: {
    marginLeft: 4,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
});

export default JournalEntryScreen;