import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, Alert } from 'react-native';
import { getAuth, signInAnonymously } from "firebase/auth";

const colorOptions = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];

const Start = ({ navigation }) => {
    const auth = getAuth();
    const [name, setName] = useState('');
    const [selectedColor, setSelectedColor] = useState(colorOptions[0]);

    const handleColorSelection = (color) => {
        setSelectedColor(color);
    };

    const signInUser = () => {
        signInAnonymously(auth)
            .then((result) => {
                navigation.replace("Chat", {
                    uid: result.user.uid,
                    name: name,
                    selectedColor: selectedColor ? selectedColor : "white",
                });
                Alert.alert("Signed in successfully!");
            })
            .catch((error) => {
                console.log("Error signing in:", error);
                Alert.alert("Unable to sign in, try again later.");
            });
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.textInput}
                value={name}
                onChangeText={setName}
                placeholder='Type your username here'
                placeholderTextColor='#ccc'
            />
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
            <TouchableOpacity
                style={[styles.startButton, { backgroundColor: selectedColor }]}
                onPress={signInUser}
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
