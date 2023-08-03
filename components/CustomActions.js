import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { useActionSheet } from '@expo/react-native-action-sheet';

const CustomActions = ({ onSend, user }) => {
    const actionSheet = useActionSheet();

    const onActionPress = () => {
        const options = ['Choose From Library', 'Take Picture', 'Send Location', 'Cancel'];
        const cancelButtonIndex = options.length - 1;
        actionSheet.showActionSheetWithOptions(
            {
                options,
                cancelButtonIndex,
            },
            async (buttonIndex) => {
                switch (buttonIndex) {
                    case 0:
                        pickImage();
                        return;
                    case 1:
                        takePhoto();
                        return;
                    case 2:
                        getLocation();
                        return;
                    default:
                }
            }
        );
    };

    const pickImage = async () => {
        let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult?.granted === false) {
            console.log('Permission to access media library denied');
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync();
        if (!result.cancelled) {
            onSend([
                {
                    _id: Math.random().toString(),
                    image: result.uri,
                    createdAt: new Date(),
                    user: {
                        _id: user._id, // Use the user prop to get the current user's ID
                        name: 'React Native',
                    },
                },
            ]);
        }
    };

    const takePhoto = async () => {
        let permissionResult = await ImagePicker.requestCameraPermissionsAsync();
        if (permissionResult?.granted === false) {
            console.log('Permission to access camera denied');
            return;
        }

        let result = await ImagePicker.launchCameraAsync();
        if (!result.cancelled) {
            onSend([
                {
                    _id: Math.random().toString(),
                    image: result.uri,
                    createdAt: new Date(),
                    user: {
                        _id: user._id, // Use the user prop to get the current user's ID
                        name: 'React Native',
                    },
                },
            ]);
        }
    };

    const getLocation = async () => {
        let permissionResult = await Location.requestForegroundPermissionsAsync();
        if (permissionResult?.granted === false) {
            console.log('Permission to access location denied');
            return;
        }

        const location = await Location.getCurrentPositionAsync({});
        if (location) {
            onSend([
                {
                    _id: Math.random().toString(),
                    text: 'My location',
                    createdAt: new Date(),
                    user: {
                        _id: user._id, // Use the user prop to get the current user's ID
                        name: 'React Native',
                    },
                    location: {
                        longitude: location.coords.longitude,
                        latitude: location.coords.latitude,
                    },
                },
            ]);
        }
    };

    return (
        <TouchableOpacity style={styles.container} onPress={onActionPress}>
            <View style={[styles.wrapper]}>
                <Text style={[styles.iconText]}>+</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        width: 26,
        height: 26,
        marginLeft: 10,
        marginBottom: 10,
    },
    wrapper: {
        borderRadius: 13,
        borderColor: '#b2b2b2',
        borderWidth: 2,
        flex: 1,
    },
    iconText: {
        color: '#b2b2b2',
        fontWeight: 'bold',
        fontSize: 16,
        backgroundColor: 'transparent',
        textAlign: 'center',
    },
});

export default CustomActions;
