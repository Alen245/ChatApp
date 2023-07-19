import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput } from 'react-native';

const Start = ({ navigation }) => {
    const [name, setName] = useState('');

    const handleStartChat = () => {
        navigation.navigate('Chat', { name: name });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Hello Start!</Text>
            <TextInput
                style={styles.textInput}
                value={name}
                onChangeText={setName}
                placeholder='Type your username here'
                placeholderTextColor='#ccc'
            />
            <TouchableOpacity style={styles.startButton} onPress={handleStartChat}>
                <Text style={styles.buttonText}>Start Chat</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
    },
    textInput: {
        width: 250,
        height: 40,
        backgroundColor: '#fff',
        paddingHorizontal: 10,
        marginBottom: 10,
        borderRadius: 5,
    },
    startButton: {
        backgroundColor: 'blue',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default Start;
