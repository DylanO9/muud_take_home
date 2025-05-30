import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Animated, Keyboard, TouchableWithoutFeedback, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SignupScreen = ({ navigation }: any) => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

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

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match. Please make sure both passwords are identical.');
      return;
    }

    if (!username || !password) {
      Alert.alert('Error', 'Please fill in all required fields (username and password).');
      return;
    }

    try {
      const response = await fetch('https://muud-take-home.onrender.com/users/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          password: password
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        // Store the token and user data
        await AsyncStorage.setItem('userToken', data.token);
        await AsyncStorage.setItem('userData', JSON.stringify(data.user));
        // Navigate to main app
        navigation.navigate('MainApp');
      } else {
        if (response.status === 409) {
          Alert.alert('Error', 'This username is already taken. Please choose a different username.');
        } else if (response.status === 400) {
          Alert.alert('Error', 'Invalid input. Please check your username and password format.');
        } else {
          Alert.alert('Error', data.error || 'Failed to sign up. Please try again later.');
        }
      }
    } catch (error) {
      Alert.alert(
        'Connection Error',
        'Unable to connect to the server. Please check your internet connection and try again.'
      );
    }
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
          <View style={styles.formContainer}>
            <Text style={styles.title}>Create Account</Text>
            <TextInput
              style={styles.input}
              placeholder="Username"
              value={username}
              onChangeText={setUsername}
              keyboardType="default"
              autoCapitalize="none"
              placeholderTextColor="#4a90e2"
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholderTextColor="#4a90e2"
            />
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              placeholderTextColor="#4a90e2"
            />
            <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
              <MaterialCommunityIcons name="account-plus" size={24} color="#fff" />
              <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.loginButton} 
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.loginText}>
                Already have an account? <Text style={styles.loginLink}>Login</Text>
              </Text>
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
  contentContainer: {
    flex: 1,
    padding: 20,
    zIndex: 1,
    justifyContent: 'center',
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4a90e2',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    color: '#4a90e2',
  },
  signupButton: {
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
  loginButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  loginText: {
    color: '#4a90e2',
    fontSize: 16,
  },
  loginLink: {
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});

export default SignupScreen; 