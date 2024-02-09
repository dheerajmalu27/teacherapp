// authService.js
import AsyncStorage from '@react-native-async-storage/async-storage';

export const checkAuth = async () => {
  try {
    // Check if the authToken is stored in AsyncStorage
    const authToken = await AsyncStorage.getItem('authToken');

    // If authToken exists, the user is authenticated
    return !!authToken;
  } catch (error) {
    // Handle errors (e.g., AsyncStorage errors)
    console.error('Error checking authentication:', error);
    return false;
  }
};
