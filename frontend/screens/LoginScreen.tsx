import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Animated, Keyboard, TouchableWithoutFeedback, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation }: any) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

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

  const handleLogin = async () => {
    try {
      const response = await fetch('https://muud-take-home.onrender.com/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username, // Using email as username since that's what the input field is labeled as
          password: password
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        // Store the token
        await AsyncStorage.setItem('userToken', data.token);
        await AsyncStorage.setItem('userData', JSON.stringify(data.user));
        // Navigate to main app
        navigation.navigate('MainApp');
      } else {
        // Show error message
        Alert.alert('Error', data.error || 'Failed to login');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to connect to server');
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
            <Text style={styles.title}>Welcome Back</Text>
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
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <MaterialCommunityIcons name="login" size={24} color="#fff" />
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.signupButton} 
              onPress={() => navigation.navigate('Signup')}
            >
              <Text style={styles.signupText}>
                Don't have an account? <Text style={styles.signupLink}>Sign up</Text>
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
  loginButton: {
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
  signupButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  signupText: {
    color: '#4a90e2',
    fontSize: 16,
  },
  signupLink: {
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});

export default LoginScreen; 