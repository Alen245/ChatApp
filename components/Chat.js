import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Platform, KeyboardAvoidingView, TouchableOpacity, Text, Alert } from 'react-native';
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat'; // Import InputToolbar from the "react-native-gifted-chat" package
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Chat = ({ route, navigation, db, isConnected }) => {
    const { name, selectedColor, uid } = route.params;
    const [messages, setMessages] = useState([]);
    const [cachedMessages, setCachedMessages] = useState([]);

    useEffect(() => {
        navigation.setOptions({
            title: name,
            headerLeft: () => (
                <TouchableOpacity style={styles.backButton} onPress={handleBackButton}>
                    <Text style={styles.backButtonText}>Back</Text>
                </TouchableOpacity>
            ),
        });

        const messagesRef = collection(db, 'messages');
        const q = query(messagesRef, orderBy('createdAt', 'desc'));

        if (isConnected) {
            const unsubscribe = onSnapshot(q, (snapshot) => {
                const messageList = [];
                snapshot.forEach((doc) => {
                    const message = doc.data();
                    // Convert the Firestore Timestamp to a Date object
                    message.createdAt = message.createdAt.toDate();
                    messageList.push(message);
                });
                setMessages(messageList);
                cacheMessages(messageList);
            });

            return () => {
                unsubscribe(); // Stop listening for updates and clean up the listener when the component is unmounted
            };
        } else {
            loadCachedMessages();
        }
    }, [db, isConnected, name, navigation]);

    const cacheMessages = async (messageList) => {
        try {
            await AsyncStorage.setItem('cachedMessages', JSON.stringify(messageList));
        } catch (error) {
            console.log('Error caching messages:', error);
        }
    };

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

    const onSend = (newMessages) => {
        addDoc(collection(db, 'messages'), newMessages[0])
            .then(() => {
                console.log('Message sent successfully!');
            })
            .catch((error) => {
                console.log('Error sending message:', error);
            });
    };

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

    // Function to render the InputToolbar based on the connection status
    const renderInputToolbar = (props) => {
        if (isConnected) return <InputToolbar {...props} />;
        else return null;
    };

    return (
        <View style={[styles.container, { backgroundColor: selectedColor }]}>
            <GiftedChat
                messages={isConnected ? messages : cachedMessages}
                renderBubble={renderBubble}
                renderInputToolbar={renderInputToolbar} // Use the custom renderInputToolbar function
                onSend={(newMessages) => onSend(newMessages)}
                user={{
                    _id: uid, // Use the user ID passed from the Start screen
                    name: name, // Use the user name passed from the Start screen
                }}
            />
            {Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
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
});

export default Chat;
