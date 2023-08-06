import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Platform, KeyboardAvoidingView, TouchableOpacity, Text } from 'react-native';
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomActions from './CustomActions';
import MapView from 'react-native-maps';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';

const Chat = ({ route, navigation, db, isConnected }) => {
    // Destructure parameters from the navigation route
    const { name, selectedColor, uid } = route.params;

    // Set up state for chat messages and cached messages
    const [messages, setMessages] = useState([]);
    const [cachedMessages, setCachedMessages] = useState([]);

    // Set up useEffect to subscribe to messages when the component mounts
    useEffect(() => {
        // Configure navigation header options (Back button and Offline status)
        navigation.setOptions({
            title: name,
            headerLeft: () => (
                <TouchableOpacity style={styles.backButton} onPress={handleBackButton}>
                    <Text style={styles.backButtonText}>Back</Text>
                </TouchableOpacity>
            ),
            headerRight: () => !isConnected && <Text style={styles.offlineText}>Offline</Text>,
        });

        // If not connected to the internet, load cached messages and return
        if (!isConnected) {
            loadCachedMessages();
            return;
        }

        // Set up Firestore query to listen for new messages
        const messagesRef = collection(db, 'messages');
        const q = query(messagesRef, orderBy('createdAt', 'desc'));

        // Subscribe to the query using onSnapshot, and update state with new messages
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const messageList = [];
            snapshot.forEach((doc) => {
                const message = doc.data();
                message.createdAt = message.createdAt.toDate();
                messageList.push(message);
            });
            setMessages(messageList);
            cacheMessages(messageList);
        });

        // Unsubscribe from the query when the component unmounts
        return () => {
            unsubscribe();
        };
    }, [db, isConnected, name, navigation]);

    // Function to cache messages using AsyncStorage
    const cacheMessages = async (messageList) => {
        try {
            await AsyncStorage.setItem('cachedMessages', JSON.stringify(messageList));
        } catch (error) {
            console.log('Error caching messages:', error);
        }
    };

    // Function to load cached messages from AsyncStorage
    const loadCachedMessages = async () => {
        try {
            const cachedMessages = await AsyncStorage.getItem('cachedMessages');
            if (cachedMessages !== null) {
                setCachedMessages(JSON.parse(cachedMessages));
            }
        } catch (error) {
            console.log('Error loading cached messages:', error);
        }
    };

    // Function to handle the Back button press and navigate to the Start screen
    const handleBackButton = () => {
        navigation.navigate('Start');
    };

    // Function to handle sending a new message
    const onSend = (newMessages = []) => {
        if (newMessages.length > 0) {
            // Add the new message to Firestore
            addDoc(collection(db, 'messages'), newMessages[0])
                .then(() => {
                    console.log('Message sent successfully!');
                })
                .catch((error) => {
                    console.log('Error sending message:', error);
                });
        }
    };

    // Function to customize the appearance of the chat bubbles
    const renderBubble = (props) => {
        return (
            <Bubble
                {...props}
                wrapperStyle={{
                    right: {
                        backgroundColor: '#000', // Background color for the sender's messages
                    },
                    left: {
                        backgroundColor: '#FFF', // Background color for other participants' messages
                    },
                }}
            />
        );
    };

    // Function to customize the appearance of the input toolbar
    const renderInputToolbar = (props) => {
        return (
            <InputToolbar {...props} />
        );
    };

    // Function to handle the action press (e.g., send location, pick image)
    const onActionPress = () => {
        // Implement your logic for handling actions here
        // For example, you can open a modal or perform other actions based on the user's choice.
        console.log('Action pressed!');
    };

    // Function to render custom actions (e.g., send location, pick image) in the input toolbar
    const renderCustomActions = (props) => {
        return <CustomActions {...props} onActionPress={onActionPress} user={{ _id: uid, name }} />;
    };

    // Function to render the MapView when a message contains location data
    const renderCustomView = (props) => {
        const { currentMessage } = props;
        if (currentMessage.location) {
            return (
                <MapView
                    style={{ width: 150, height: 100, borderRadius: 13, margin: 3 }}
                    region={{
                        latitude: currentMessage.location.latitude,
                        longitude: currentMessage.location.longitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                />
            );
        }
        return null;
    };

    // Return the GiftedChat component with the customizations
    return (
        <View style={[styles.container, { backgroundColor: selectedColor }]}>
            <GiftedChat
                messages={isConnected ? messages : cachedMessages} // Display connected messages or cached messages when offline
                renderBubble={renderBubble}
                renderInputToolbar={renderInputToolbar}
                onSend={(newMessages) => onSend(newMessages)}
                user={{
                    _id: uid,
                    name: name,
                }}
                renderActions={renderCustomActions}
                renderCustomView={renderCustomView} // Add the renderCustomView prop to display the MapView for location messages
            />
            {Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    backButton: {
        marginLeft: 16,
        padding: 8,
    },
    backButtonText: {
        fontSize: 16,
        color: '#007AFF',
    },
    offlineText: {
        color: 'red',
        fontWeight: 'bold',
        position: 'absolute',
        top: 0,
        right: 16,
        zIndex: 1,
    },
});

export default Chat;
