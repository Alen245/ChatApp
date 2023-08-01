// Import required modules and components
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Platform, KeyboardAvoidingView, TouchableOpacity, Text, Alert } from 'react-native';
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define the Chat component function that takes route, navigation, db, and isConnected as props
const Chat = ({ route, navigation, db, isConnected }) => {
    // Destructure properties from the route.params object
    const { name, selectedColor, uid } = route.params;

    // Define state variables for maintaining messages and cached messages
    const [messages, setMessages] = useState([]);
    const [cachedMessages, setCachedMessages] = useState([]);

    // useEffect hook is used to manage side effects (e.g., fetching data) and update component state
    useEffect(() => {
        // Update the header options for this screen
        navigation.setOptions({
            title: name,
            headerLeft: () => (
                // Render a custom "Back" button in the header that navigates to the Start screen
                <TouchableOpacity style={styles.backButton} onPress={handleBackButton}>
                    <Text style={styles.backButtonText}>Back</Text>
                </TouchableOpacity>
            ),
            headerRight: () => !isConnected && <Text style={styles.offlineText}>Offline</Text>,
            // Show "Offline" text in the header if the user is not connected to the internet
        });

        // If the user is offline, load the cached messages and return
        if (!isConnected) {
            loadCachedMessages();
            return;
        }

        // Create a Firestore reference to the 'messages' collection and order messages by creation date
        const messagesRef = collection(db, 'messages');
        const q = query(messagesRef, orderBy('createdAt', 'desc'));

        // Set up a listener to receive real-time updates from the 'messages' collection
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const messageList = [];
            snapshot.forEach((doc) => {
                const message = doc.data();
                // Convert the Firestore Timestamp to a Date object for each message
                message.createdAt = message.createdAt.toDate();
                messageList.push(message);
            });
            // Update the state with the latest messages and cache them
            setMessages(messageList);
            cacheMessages(messageList);
        });

        // Clean up the listener when the component is unmounted to avoid memory leaks
        return () => {
            unsubscribe();
        };
    }, [db, isConnected, name, navigation]);

    // Function to cache the messages in AsyncStorage
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

    // Function to handle the back button press and navigate back to the Start screen
    const handleBackButton = () => {
        navigation.navigate('Start');
    };

    // Function to send a new message to the Firestore database
    const onSend = (newMessages) => {
        addDoc(collection(db, 'messages'), newMessages[0])
            .then(() => {
                console.log('Message sent successfully!');
            })
            .catch((error) => {
                console.log('Error sending message:', error);
            });
    };

    // Function to customize the appearance of message bubbles
    const renderBubble = (props) => {
        return (
            <Bubble
                {...props}
                wrapperStyle={{
                    right: {
                        backgroundColor: '#000',
                    },
                    left: {
                        backgroundColor: '#FFF',
                    },
                }}
            />
        );
    };

    // Function to render the input toolbar based on the connection status
    const renderInputToolbar = (props) => {
        if (!isConnected) return; // If offline, hide the input toolbar
        return <InputToolbar {...props} />;
    };

    // Return the JSX representing the Chat component
    return (
        <View style={[styles.container, { backgroundColor: selectedColor }]}>
            {/* Render the GiftedChat component */}
            <GiftedChat
                messages={isConnected ? messages : cachedMessages} // Show real-time messages if connected, otherwise show cached messages
                renderBubble={renderBubble} // Use the custom renderBubble function for message bubbles
                renderInputToolbar={renderInputToolbar} // Use the custom renderInputToolbar function
                onSend={(newMessages) => onSend(newMessages)} // Call onSend function when a new message is sent
                user={{
                    _id: uid, // Use the user ID passed from the Start screen
                    name: name, // Use the user name passed from the Start screen
                }}
            />
            {Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
            {/* Render an action button */}
            <TouchableOpacity
                accessible={true}
                accessibilityLabel="More options"
                accessibilityHint="Lets you choose to send an image or your geolocation."
                accessibilityRole="button"
                onPress={() => console.log('Action button pressed!')}
            >
                <View style={styles.actionButton}>
                    {/* Your action button content */}
                </View>
            </TouchableOpacity>
        </View>
    );
};

// Define the component styles using StyleSheet
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    actionButton: {
        // Your action button styles
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

// Export the Chat component as the default export
export default Chat;
