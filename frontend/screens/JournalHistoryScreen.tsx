import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
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
  listContainer: {
    padding: 20,
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