import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface JournalEntry {
  journal_entry_id: number;
  user_id: number;
  entry_text: string;
  mood_rating: number;
  timestamp: string;
}

interface Contact {
  contact_id: number;
  user_id: number;
  contact_name: string;
  contact_email: string;
}

interface AppContextType {
  journalEntries: JournalEntry[];
  contacts: Contact[];
  addJournalEntry: (entry: JournalEntry) => void;
  addContact: (contact: Contact) => void;
  fetchJournalEntries: () => Promise<void>;
  fetchContacts: () => Promise<void>;
  userId: string | null;
  setUserId: (id: string | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  const fetchJournalEntries = async () => {
    if (!userId) return;
    
    try {
      const response = await fetch(`https://muud-take-home.onrender.com/journal/user/${userId}`, {
        headers: {
          'Authorization': `BEARER ${await AsyncStorage.getItem('userToken')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch journal entries');
      }

      const data = await response.json();
      setJournalEntries(data);
    } catch (error) {
      console.error('Error fetching journal entries:', error);
    }
  };

  const fetchContacts = async () => {
    if (!userId) return;
    
    try {
      const response = await fetch(`https://muud-take-home.onrender.com/contacts/user/${userId}`, {
        headers: {
          'Authorization': `BEARER ${await AsyncStorage.getItem('userToken')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch contacts');
      }

      const data = await response.json();
      setContacts(data);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    }
  };

  const addJournalEntry = (entry: JournalEntry) => {
    setJournalEntries(prevEntries => [entry, ...prevEntries]);
  };

  const addContact = (contact: Contact) => {
    setContacts(prevContacts => [...prevContacts, contact]);
  };

  useEffect(() => {
    if (userId) {
      fetchJournalEntries();
      fetchContacts();
    }
  }, [userId]);

  return (
    <AppContext.Provider
      value={{
        journalEntries,
        contacts,
        addJournalEntry,
        addContact,
        fetchJournalEntries,
        fetchContacts,
        userId,
        setUserId,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}; 