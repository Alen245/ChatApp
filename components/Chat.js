import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Platform, KeyboardAvoidingView, TouchableOpacity, Text } from 'react-native';
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomActions from './CustomActions';
import MapView from 'react-native-maps';

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
            headerRight: () => !isConnected && <Text style={styles.offlineText}>Offline</Text>,
        });

        if (!isConnected) {
            loadCachedMessages();
            return;
        }

        const messagesRef = collection(db, 'messages');
        const q = query(messagesRef, orderBy('createdAt', 'desc'));

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

        return () => {
            unsubscribe();
        };
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

    const handleBackButton = () => {
        navigation.navigate('Start');
    };

    const onSend = (newMessages = []) => {
        if (newMessages.length > 0) {
            addDoc(collection(db, 'messages'), newMessages[0])
                .then(() => {
                    console.log('Message sent successfully!');
                })
                .catch((error) => {
                    console.log('Error sending message:', error);
                });
        }
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

    const renderInputToolbar = (props) => {
        if (!isConnected) return;
        return <InputToolbar {...props} />;
    };

    const renderCustomActions = (props) => {
        return <CustomActions {...props} onSend={onSend} />;
    };

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

    return (
        <View style={[styles.container, { backgroundColor: selectedColor }]}>
            <GiftedChat
                messages={isConnected ? messages : cachedMessages}
                renderBubble={renderBubble}
                renderInputToolbar={renderInputToolbar}
                onSend={(newMessages) => onSend(newMessages)}
                user={{
                    _id: uid,
                    name: name,
                }}
                renderActions={renderCustomActions}
                renderCustomView={renderCustomView} // Add the renderCustomView prop
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
