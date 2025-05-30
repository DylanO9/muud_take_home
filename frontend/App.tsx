import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import JournalEntryScreen from './screens/JournalEntryScreen';
import JournalHistoryScreen from './screens/JournalHistoryScreen';
import ContactsScreen from './screens/ContactsScreen';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppProvider } from './context/AppContext';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const LogoutScreen = ({ navigation }: any) => {
  const handleLogout = async () => {
    try {
      await AsyncStorage.multiRemove(['userToken', 'userData']);
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  React.useEffect(() => {
    handleLogout();
  }, []);

  return null;
};

const MainTabs = () => {
  return (
    <AppProvider>
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <Tab.Navigator
          screenOptions={{
            headerShown: true,
            headerStyle: {
              backgroundColor: '#fff',
              elevation: 0,
              shadowOpacity: 0,
              borderBottomWidth: 1,
              borderBottomColor: '#eee',
            },
            headerTitleStyle: {
              fontSize: 20,
              fontWeight: 'bold',
              color: '#4a90e2',
            },
            headerTitleAlign: 'center',
            tabBarStyle: {
              height: 40,
              paddingBottom: 0,
              borderTopWidth: 1,
              borderTopColor: '#eee',
              backgroundColor: '#fff',
            },
            tabBarActiveTintColor: '#007AFF',
            tabBarInactiveTintColor: '#666',
            tabBarLabelStyle: {
              fontSize: 12,
              marginTop: -5,
            },
          }}
        >
          <Tab.Screen
            name="New Entry"
            component={JournalEntryScreen}
            options={{
              title: 'Journal Entry',
              tabBarIcon: ({ color }) => (
                <MaterialCommunityIcons name="pencil-plus" size={22} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="Journal History"
            component={JournalHistoryScreen}
            options={{
              title: 'Journal History',
              tabBarIcon: ({ color }) => (
                <MaterialCommunityIcons name="book-open-variant" size={22} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="Contacts"
            component={ContactsScreen}
            options={{
              title: 'Contacts',
              tabBarIcon: ({ color }) => (
                <MaterialCommunityIcons name="account-group" size={22} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="Logout"
            component={LogoutScreen}
            options={{
              title: 'Logout',
              tabBarIcon: ({ color }) => (
                <MaterialCommunityIcons name="logout" size={22} color={color} />
              ),
            }}
          />
        </Tab.Navigator>
      </SafeAreaView>
    </AppProvider>
  );
};

const App = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
          <Stack.Screen name="MainApp" component={MainTabs} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
