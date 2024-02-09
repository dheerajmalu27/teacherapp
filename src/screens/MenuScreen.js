// src/screens/MenuScreen.js
import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const MenuScreen = ({navigation}) => {
  const handleMenuItemClick = item => {
    // Handle item click as needed
    // You can navigate to other screens or perform other actions
    console.log(`Clicked on ${item}`);
    // Close the drawer after handling the click
    navigation.closeDrawer();
  };

  return (
    <View style={styles.container}>
      <Text onPress={() => handleMenuItemClick('Menu Item 1')}>
        Menu Item 1
      </Text>
      <Text onPress={() => handleMenuItemClick('Menu Item 2')}>
        Menu Item 2
      </Text>
      <Text onPress={() => handleMenuItemClick('Menu Item 3')}>
        Menu Item 3
      </Text>
      {/* Add more menu items as needed */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default MenuScreen;
