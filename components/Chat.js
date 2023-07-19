import React, { useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';

const Chat = ({ route, navigation }) => {
    const { name } = route.params;

    useEffect(() => {
        navigation.setOptions({ title: name });
    }, [name]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Hello Chat!</Text>
            <Text style={styles.chatText}>Welcome, {name}!</Text>
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
    chatText: {
        fontSize: 18,
    },
});

export default Chat;