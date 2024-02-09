// screens/Auth/LoginScreen.js
import React, {useState} from 'react';
import {View, Text, StyleSheet, ImageBackground} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';

import TextInput from '../../components/TextInput';
import Button from '../../components/Button';
import {login} from '../../utils/api';

const LoginScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const result = await login(email, password);
      const authToken = result.token;
      await AsyncStorage.setItem('authToken', authToken);
      await AsyncStorage.setItem('teacherId', result.teacher.id.toString());
      await AsyncStorage.setItem(
        'classTeacherId',
        result.classteacher.id.toString(),
      );
      await AsyncStorage.setItem(
        'classId',
        result.classteacher.classId.toString(),
      );
      await AsyncStorage.setItem('divId', result.classteacher.divId.toString());
      await AsyncStorage.setItem(
        'teacherName',
        result.teacher.firstName + ' ' + result.teacher.lastName,
      );
      navigation.navigate('Home');
    } catch (error) {
      console.error('Login Failed:', error.message);
    }
  };

  return (
    <ImageBackground
      source={require('../../../assets/background.jpg')} // Replace with your background image
      style={styles.backgroundImage}>
      <View style={styles.container}>
        {/* Remove the title */}
        <Text style={styles.title}></Text>
        <TextInput
          placeholder="Email"
          onChangeText={text => setEmail(text)}
          value={email}
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
          placeholderTextColor="#000" // White placeholder text color
          underlineColorAndroid="transparent" // Remove the default underline on Android
        />
        <TextInput
          placeholder="Password"
          secureTextEntry
          onChangeText={text => setPassword(text)}
          value={password}
          style={styles.input}
          placeholderTextColor="#000" // White placeholder text color
          underlineColorAndroid="transparent" // Remove the default underline on Android
        />
        <Button title="Login" onPress={handleLogin} style={styles.button} />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff', // White text color
    marginBottom: 24,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)', // Semi-transparent white background
    borderRadius: 8,
    marginBottom: 16,
    padding: 12,
    width: '100%',
    color: '#000', // White text color
  },
  button: {
    backgroundColor: '#3498db', // Blue color
    borderRadius: 8,
    padding: 12,
    width: '100%',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
});

export default LoginScreen;
