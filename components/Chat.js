import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Platform, KeyboardAvoidingView, TouchableOpacity, Text, Alert } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';

const Chat = ({ route, navigation, database }) => {
    const { name, selectedColor, uid } = route.params;
    const [messages, setMessages] = useState([]);

    // Function to handle the back button press and navigate back to the Start screen
    const handleBackButton = () => {
        navigation.navigate('Start');
    };

    useEffect(() => {
        navigation.setOptions({
            title: name,
            headerLeft: () => (
                <TouchableOpacity style={styles.backButton} onPress={handleBackButton}>
                    <Text style={styles.backButtonText}>Back</Text>
                </TouchableOpacity>
            ),
        });

        const messagesRef = collection(database, 'messages');
        const q = query(messagesRef, orderBy('createdAt', 'desc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const messageList = [];
            snapshot.forEach((doc) => {
                const message = doc.data();
                // Convert the Firestore Timestamp to a Date object
                message.createdAt = message.createdAt.toDate();
                messageList.push(message);
            });
            setMessages(messageList);
        });

        return () => {
            unsubscribe(); // Stop listening for updates and clean up the listener when the component is unmounted
        };
    }, [database, name, navigation]);

    const onSend = (newMessages) => {
        addDoc(collection(database, 'messages'), newMessages[0])
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

    return (
        <View style={[styles.container, { backgroundColor: selectedColor }]}>
            <GiftedChat
                messages={messages}
                renderBubble={renderBubble}
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
