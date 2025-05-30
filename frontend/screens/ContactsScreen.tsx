import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Animated, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface Contact {
  id: number;
  name: string;
  phone: string;
  email: string;
}

const ContactsScreen = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [contacts, setContacts] = useState<Contact[]>([
    { id: 1, name: 'John Doe', phone: '123-456-7890', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', phone: '098-765-4321', email: 'jane@example.com' },
  ]);

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

  const handleAddContact = () => {
    if (name && phone && email) {
      const newContact = {
        id: contacts.length + 1,
        name,
        phone,
        email,
      };
      setContacts([...contacts, newContact]);
      setName('');
      setPhone('');
      setEmail('');
      Keyboard.dismiss();
    }
  };

  const renderContact = ({ item }: { item: Contact }) => (
    <View style={styles.contactCard}>
      <View style={styles.contactHeader}>
        <MaterialCommunityIcons name="account" size={24} color="#4a90e2" />
        <Text style={styles.contactName}>{item.name}</Text>
      </View>
      <View style={styles.contactInfo}>
        <MaterialCommunityIcons name="phone" size={20} color="#4a90e2" />
        <Text style={styles.contactText}>{item.phone}</Text>
      </View>
      <View style={styles.contactInfo}>
        <MaterialCommunityIcons name="email" size={20} color="#4a90e2" />
        <Text style={styles.contactText}>{item.email}</Text>
      </View>
    </View>
  );

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
          <View style={styles.formContainer}>
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={name}
              onChangeText={setName}
              placeholderTextColor="#4a90e2"
            />
            <TextInput
              style={styles.input}
              placeholder="Phone"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              placeholderTextColor="#4a90e2"
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              placeholderTextColor="#4a90e2"
            />
            <TouchableOpacity style={styles.addButton} onPress={handleAddContact}>
              <MaterialCommunityIcons name="account-plus" size={24} color="#fff" />
              <Text style={styles.buttonText}>Add Contact</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={contacts}
            renderItem={renderContact}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContainer}
          />
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
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    fontSize: 16,
    color: '#4a90e2',
  },
  addButton: {
    backgroundColor: '#4a90e2',
    borderRadius: 10,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  listContainer: {
    paddingBottom: 20,
  },
  contactCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  contactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  contactName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4a90e2',
    marginLeft: 10,
  },
  contactInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  contactText: {
    fontSize: 16,
    color: '#4a90e2',
    marginLeft: 10,
  },
});

export default ContactsScreen;