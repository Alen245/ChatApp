// export default Chat;
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Platform, KeyboardAvoidingView, TouchableOpacity } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';

const Chat = ({ route, navigation }) => {
    const { name, selectedColor } = route.params;
    const [messages, setMessages] = useState([]);

    const onSend = (newMessages) => {
        setMessages((previousMessages) => GiftedChat.append(previousMessages, newMessages));
    };

    useEffect(() => {
        navigation.setOptions({ title: name })
        setMessages([
            {
                _id: 1,
                text: 'Hello developer',
                createdAt: new Date(),
                user: {
                    _id: 2,
                    name: 'React Native',
                    avatar: 'https://placeimg.com/140/140/any',
                },
            },
            {
                _id: 2,
                text: 'This is a system message',
                createdAt: new Date(),
                system: true,
            },
        ]);

    }, []);

    useEffect(() => {
        navigation.setOptions({ title: name });
    }, []);

    // Custom renderBubble function to customize speech bubble colors
    const renderBubble = (props) => {
        return (
            <Bubble
                {...props}
                wrapperStyle={{
                    right: {
                        backgroundColor: '#000', // Black color for the sender
                    },
                    left: {
                        backgroundColor: '#FFF', // White color for the receiver
                    },
                }}
            />
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: selectedColor }]}>
            {/* Gifted Chat component */}
            <GiftedChat
                messages={messages}
                renderBubble={renderBubble} // Apply the custom renderBubble function
                onSend={messages => onSend(messages)}
                user={{
                    _id: 1,
                }}
            />
            {/* KeyboardAvoidingView for Android */}
            {Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
            {/* Action Button */}
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
});

export default Chat;
