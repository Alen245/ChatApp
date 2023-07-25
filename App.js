// App.js
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Start from './components/Start';
import Chat from './components/Chat';

// Import the functions you need from the SDKs you need (Firebase)
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Create a stack navigator for navigation within the app
const Stack = createNativeStackNavigator();

const App = () => {
  // Firebase configuration containing necessary information to initialize Firebase app
  const firebaseConfig = {
    apiKey: "AIzaSyByyFq5TFyPiVMQkcYdcvjy_4I6Rplc9Dg",
    authDomain: "chatapp-2e41b.firebaseapp.com",
    projectId: "chatapp-2e41b",
    storageBucket: "chatapp-2e41b.appspot.com",
    messagingSenderId: "11275463379",
    appId: "1:11275463379:web:ea2d0a09ead8ccc58ac226",
    measurementId: "G-8SWTFCP3G5"
  };

  // Initialize Firebase app with the provided configuration
  const app = initializeApp(firebaseConfig);

  // Get Firestore database object using the initialized Firebase app
  const db = getFirestore(app);

  // Component rendering and navigation setup
  return (
    // Wrap the entire app with NavigationContainer for navigation functionality
    <NavigationContainer>
      {/* Stack navigator with initial route name set to "Start" */}
      <Stack.Navigator initialRouteName="Start">
        {/* Screen for the Start component, with header hidden */}
        <Stack.Screen
          name="Start"
          component={Start}
          options={{ headerShown: false }}
        />
        {/* Screen for the Chat component, with title set to the name passed as a parameter */}
        {/* Also passing the Firestore database object as an initial parameter to Chat */}
        <Stack.Screen
          name="Chat"
          options={({ route }) => ({ title: route.params.name })}
        >
          {(props) => <Chat {...props} database={db} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;






