// src/screens/LogoutScreen.js
import React, {useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LogoutScreen = ({navigation}) => {
  useEffect(() => {
    // Perform logout actions
    const logout = async () => {
      try {
        // Clear AsyncStorage or any other local storage you are using
        await AsyncStorage.clear();
        // Redirect to the login screen
        navigation.replace('Login');
      } catch (error) {
        console.error('Error during logout:', error);
      }
    };

    logout();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text>Logging out...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LogoutScreen;
