import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { Alert, LogBox } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNetInfo } from '@react-native-community/netinfo'; // Import the useNetInfo hook
import { getStorage } from 'firebase/storage';
import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  disableNetwork,
  enableNetwork,
} from 'firebase/firestore';

import Start from './components/Start';
import Chat from './components/Chat';

LogBox.ignoreLogs(['AsyncStorage has been extracted from']);

const Stack = createNativeStackNavigator();

const App = () => {
  const connectionStatus = useNetInfo(); // Use the useNetInfo hook to get the network connectivity status

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

  // Get a reference to the database service
  const db = getFirestore(app);
  const storage = getStorage(app);

  useEffect(() => {
    if (connectionStatus.isConnected === false) {
      Alert.alert('Connection lost!');
      disableNetwork(db);
    } else if (connectionStatus.isConnected === true) {
      enableNetwork(db);
    }
  }, [connectionStatus.isConnected]);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Start'>
        <Stack.Screen name='Start' component={Start} />
        <Stack.Screen name='Chat'>
          {(props) => (
            <Chat
              isConnected={connectionStatus.isConnected}
              db={db}
              storage={storage}
              {...props}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;







// const firebaseConfig = {
//   apiKey: "AIzaSyByyFq5TFyPiVMQkcYdcvjy_4I6Rplc9Dg",
//   authDomain: "chatapp-2e41b.firebaseapp.com",
//   projectId: "chatapp-2e41b",
//   storageBucket: "chatapp-2e41b.appspot.com",
//   messagingSenderId: "11275463379",
//   appId: "1:11275463379:web:ea2d0a09ead8ccc58ac226",
//   measurementId: "G-8SWTFCP3G5"
// };