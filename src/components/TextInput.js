// components/TextInput.js
import React from 'react';
import {TextInput as RNTextInput, StyleSheet} from 'react-native';

const TextInput = ({placeholder, secureTextEntry, onChangeText, value}) => (
  <RNTextInput
    style={styles.input}
    placeholder={placeholder}
    secureTextEntry={secureTextEntry}
    onChangeText={onChangeText}
    value={value}
  />
);

const styles = StyleSheet.create({
  input: {
    height: 40,
    width: '100%',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    padding: 8,
  },
});

export default TextInput;
