import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import BottomMenu from '../menu/BottomMenu';
import {useRoute} from '@react-navigation/native';
import {getData} from '../services/commonService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../../config';
const UserProfileScreen = ({navigation}) => {
  const route = useRoute();
  const [teacherData, setTeacherData] = useState(null);

  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        const teacherId = await AsyncStorage.getItem('teacherId');
        const queryParams = {teacherId};
        const responseData = await getData('teacher/' + teacherId);
        setTeacherData(responseData.teacher);
      } catch (error) {
        console.error('Error fetching teacher data:', error);
      }
    };

    fetchTeacherData();
  }, []);
  const getGenderText = () => {
    return teacherData.gender === 1 ? 'Male' : 'Female';
  };
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Render teacher details */}
        {teacherData && (
          <>
            <View style={styles.profileContainer}>
              <Image
                style={styles.profileImage}
                source={{uri: config.IMAGE_URL + teacherData.profileImage}}
              />
              <Text style={styles.username}>
                {teacherData.firstName} {teacherData.middleName}{' '}
                {teacherData.lastName}
              </Text>
              <Text style={styles.email}>{teacherData.emailid}</Text>
              {/* <TouchableOpacity
                style={styles.editButton}
                onPress={() => navigation.navigate('EditProfile')}>
                <Ionicons name="pencil-outline" size={24} color="#fff" />
              </TouchableOpacity> */}
            </View>
            <View style={styles.detailContainer}>
              <Text style={styles.detailLabel}>Gender:</Text>
              <Text style={styles.detailValue}>{getGenderText()}</Text>
            </View>
            <View style={styles.detailContainer}>
              <Text style={styles.detailLabel}>Date of Birth:</Text>
              <Text style={styles.detailValue}>{teacherData.dateOfBirth}</Text>
            </View>
            <View style={styles.detailContainer}>
              <Text style={styles.detailLabel}>Qualification:</Text>
              <Text style={styles.detailValue}>
                {teacherData.qualification}
              </Text>
            </View>
            <View style={styles.detailContainer}>
              <Text style={styles.detailLabel}>Experience:</Text>
              <Text style={styles.detailValue}>{teacherData.experience}</Text>
            </View>
            <View style={styles.detailContainer}>
              <Text style={styles.detailLabel}>Nationality:</Text>
              <Text style={styles.detailValue}>{teacherData.nationality}</Text>
            </View>
            <View style={styles.detailContainer}>
              <Text style={styles.detailLabel}>Caste:</Text>
              <Text style={styles.detailValue}>{teacherData.caste}</Text>
            </View>
            <View style={styles.detailContainer}>
              <Text style={styles.detailLabel}>Mobile Number:</Text>
              <Text style={styles.detailValue}>{teacherData.mobileNumber}</Text>
            </View>
            <View style={styles.detailContainer}>
              <Text style={styles.detailLabel}>Address:</Text>
              <Text style={styles.detailValue}>{teacherData.address}</Text>
            </View>

            <View style={styles.detailContainer}>
              <Text style={styles.detailLabel}>Joining Date:</Text>
              <Text style={styles.detailValue}>{teacherData.joiningDate}</Text>
            </View>
            {/* Add more teacher details as needed */}
          </>
        )}
      </ScrollView>
      <BottomMenu navigation={navigation} route={route} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  profileContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 10,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  email: {
    fontSize: 16,
    color: '#777',
    marginBottom: 10,
  },
  editButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#603F8B',
    borderRadius: 20,
    padding: 5,
  },
  detailContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  detailValue: {
    fontSize: 16,
    color: '#777',
  },
});

export default UserProfileScreen;
