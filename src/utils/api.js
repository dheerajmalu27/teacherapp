// utils/api.js
import config from '../../config';
// import { AsyncStorage } from 'react-native';

const login = async (email, password) => {
  try {
    const response = await fetch(`${config.API_URL}teacher/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({email, password}),
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Login Error:', error.message);
    throw error;
  }
};

export {login};
