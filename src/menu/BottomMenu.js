import React from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const BottomMenu = ({navigation, route}) => {
  const handleSectionClick = section => {
    // Handle the click event for each section
    navigation.navigate(section);
    console.log(`Clicked on ${section}`);
    // Add your logic here
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.menuSection,
          route.name === 'Home' && {backgroundColor: '#FFF'},
        ]}
        onPress={() => handleSectionClick('Home')}>
        <MaterialCommunityIcons
          name="home"
          size={24}
          color={route.name === 'Home' ? '#603F8B' : '#666'}
        />
        <Text
          style={[
            styles.sectionText,
            route.name === 'Home' && {color: '#603F8B'},
          ]}>
          Home
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.menuSection,
          route.name === 'StudentList' && {backgroundColor: '#FFF'},
        ]}
        onPress={() => handleSectionClick('StudentList')}>
        <MaterialCommunityIcons
          name="account-circle-outline"
          size={24}
          color={route.name === 'StudentList' ? '#603F8B' : '#666'}
        />
        <Text
          style={[
            styles.sectionText,
            route.name === 'StudentList' && {color: '#603F8B'},
          ]}>
          Student Info
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.menuSection,
          route.name === 'NewsEvent' && {backgroundColor: '#FFF'},
        ]}
        onPress={() => handleSectionClick('NewsEvent')}>
        <MaterialCommunityIcons
          name="newspaper"
          size={24}
          color={route.name === 'NewsEvent' ? '#603F8B' : '#666'}
        />
        <Text
          style={[
            styles.sectionText,
            route.name === 'NewsEvent' && {color: '#603F8B'},
          ]}>
          News & Event
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.menuSection,
          route.name === 'Profile' && {backgroundColor: '#FFF'},
        ]}
        onPress={() => handleSectionClick('Profile')}>
        <MaterialCommunityIcons
          name="account"
          size={24}
          color={route.name === 'Profile' ? '#603F8B' : '#666'}
        />
        <Text
          style={[
            styles.sectionText,
            route.name === 'Profile' && {color: '#603F8B'},
          ]}>
          Profile
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around', // If you want equal spacing between items
    alignItems: 'center',
    backgroundColor: '#fff', // White background
    paddingVertical: 10,
    borderTopWidth: 1, // Add light grey border at the top
    borderTopColor: '#ddd', // Light grey color
  },
  menuSection: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 5, // Adjust padding for better visual appearance
  },
  sectionText: {
    color: '#666', // Default text color
    fontSize: 12,
  },
});

export default BottomMenu;
