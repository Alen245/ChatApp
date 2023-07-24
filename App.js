import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Start from './components/Start';
import Chat from './components/Chat';

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const Stack = createNativeStackNavigator();
const firebaseConfig = {
  apiKey: "AIzaSyByyFq5TFyPiVMQkcYdcvjy_4I6Rplc9Dg",
  authDomain: "chatapp-2e41b.firebaseapp.com",
  projectId: "chatapp-2e41b",
  storageBucket: "chatapp-2e41b.appspot.com",
  messagingSenderId: "11275463379",
  appId: "1:11275463379:web:ea2d0a09ead8ccc58ac226",
  measurementId: "G-8SWTFCP3G5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // Firestore database object

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Start">
        <Stack.Screen
          name="Start"
          component={Start}
          options={{ headerShown: false }}
        />
        {/* Pass the Firestore database object to the Chat component */}
        <Stack.Screen
          name="Chat"
          component={Chat}
          options={({ route }) => ({ title: route.params.name })}
          initialParams={{ database: db }} // Pass the database object as initial parameter
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}