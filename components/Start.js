import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput } from 'react-native';

// Array of color options that the user can choose from
const colorOptions = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];

const Start = ({ navigation }) => {
    // State variables to store the user's name and selected color
    const [name, setName] = useState('');
    const [selectedColor, setSelectedColor] = useState(colorOptions[0]);

    // Function to handle the "Start Chat" button press
    const handleStartChat = () => {
        // Navigate to the "Chat" screen and pass the user's name and selected color as parameters
        navigation.navigate('Chat', { name, selectedColor });
    };

    // Function to handle color selection when a color circle is pressed
    const handleColorSelection = (color) => {
        // Update the selectedColor state with the chosen color
        setSelectedColor(color);
    };

    return (
        <View style={styles.container}>
            {/* Text input for the user to enter their name */}
            <TextInput
                style={styles.textInput}
                value={name}
                onChangeText={setName}
                placeholder='Type your username here'
                placeholderTextColor='#ccc'
            />
            {/* Color picker displaying clickable circles for each color option */}
            <View style={styles.colorPicker}>
                {colorOptions.map((color) => (
                    <TouchableOpacity
                        key={color}
                        style={[
                            styles.colorCircle,
                            { backgroundColor: color, borderColor: selectedColor === color ? 'black' : 'transparent' },
                        ]}
                        onPress={() => handleColorSelection(color)}
                    />
                ))}
            </View>
            {/* "Start Chat" button to initiate the chat */}
            <TouchableOpacity
                style={[styles.startButton, { backgroundColor: selectedColor }]} // Use selectedColor for button background
                onPress={handleStartChat}
            >
                <Text style={styles.buttonText}>Start Chat</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    textInput: {
        width: '100%',
        height: 40,
        backgroundColor: '#fff',
        paddingHorizontal: 10,
        marginBottom: 10,
        borderRadius: 5,
    },
    colorPicker: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    colorCircle: {
        width: 50,
        height: 50,
        borderRadius: 25,
        margin: 5,
        borderWidth: 2,
    },
    startButton: {
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
