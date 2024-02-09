import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import BottomMenu from '../menu/BottomMenu';
import {useRoute} from '@react-navigation/native';

const UserProfileScreen = ({navigation}) => {
  const route = useRoute();

  return (
    <View style={styles.container}>
      <Image
        style={styles.profileImage}
        source={{uri: 'https://placekitten.com/200/300'}}
      />
      <Text style={styles.username}>John Doe</Text>
      <Text style={styles.email}>john.doe@example.com</Text>

      <View style={styles.detailsContainer}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Age:</Text>
          <Text style={styles.detailValue}>25</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Location:</Text>
          <Text style={styles.detailValue}>City, Country</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Age:</Text>
          <Text style={styles.detailValue}>25</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Location:</Text>
          <Text style={styles.detailValue}>City, Country</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Age:</Text>
          <Text style={styles.detailValue}>25</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Location:</Text>
          <Text style={styles.detailValue}>City, Country</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Age:</Text>
          <Text style={styles.detailValue}>25</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Location:</Text>
          <Text style={styles.detailValue}>City, Country</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Age:</Text>
          <Text style={styles.detailValue}>25</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Location:</Text>
          <Text style={styles.detailValue}>City, Country</Text>
        </View>
        {/* Add more details as needed */}
      </View>

      <BottomMenu navigation={navigation} route={route} />
    </View>
  );
};

UserProfileScreen.navigationOptions = ({navigation}) => ({
  title: 'Profile',
  headerTitleStyle: {
    fontWeight: 'bold',
  },
  headerRight: () => (
    <Ionicons
      name="pencil-outline"
      size={24}
      style={{marginRight: 15, fontWeight: 'bold'}}
      // color="#fff"
      onPress={() => {
        navigation.navigate('EditProfile');
      }}
    />
  ),
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 20,
    backgroundColor: '#fff',
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    // marginBottom: 10,
    color: '#333',
  },
  email: {
    fontSize: 16,
    color: '#777',
    // marginBottom: 20,
  },
  detailsContainer: {
    width: '80%',
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  detailValue: {
    fontSize: 16,
    color: '#333',
  },
});

export default UserProfileScreen;
