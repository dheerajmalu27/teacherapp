import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Platform,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons'; // Import Ionicons library
import {getData} from '../services/commonService';
import config from '../../config';
const StudentInfoScreen = ({navigation, route}) => {
  const [studentData, setStudentData] = useState({});
  const [testList, setTestList] = useState([]);
  const studentId = route.params?.studentId; // Get studentId from route params

  useEffect(() => {
    const fetchStudentProfile = async () => {
      try {
        const response = await getData('studentdetailinfo/' + studentId, {});
        console.log(response);
        setStudentData(response.studentData);
        setTestList(response.testlist);
      } catch (error) {
        console.error('Error fetching student profile data:', error);
      }
    };

    if (studentId) {
      fetchStudentProfile(); // Call the API only if studentId is available
    }
  }, [studentId]);

  const handleTestPress = testId => {
    // Navigate to ExamResult screen with studentId and testId
    navigation.navigate('ExamResult', {studentId, testId});
  };
  const handleLinkPress = phoneNumber => {
    console.log(Platform);
    const formattedPhoneNumber =
      Platform.OS === 'android'
        ? `tel:${phoneNumber}`
        : `telprompt:${phoneNumber}`;
    Linking.canOpenURL(formattedPhoneNumber)
      .then(supported => {
        if (supported) {
          return Linking.openURL(formattedPhoneNumber);
        } else {
          console.error('Cannot open URL:', formattedPhoneNumber);
        }
      })
      .catch(err => console.error('An error occurred', err));
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileContainer}>
        <View style={styles.imageContainer}>
          <Image
            source={{uri: config.IMAGE_URL + studentData.profileImage}}
            style={styles.profileImage}
          />
        </View>
        <View style={styles.profileInfo}>
          <Text
            style={
              styles.name
            }>{`${studentData.firstName} ${studentData.middleName} ${studentData.lastName}`}</Text>
          <Text
            style={
              styles.major
            }>{`STD: ${studentData.className}-${studentData.divName}`}</Text>
        </View>
      </View>
      <View style={styles.percentageContainer}>
        <View style={[styles.percentageBox, {backgroundColor: '#ecf4ff'}]}>
          <Text style={styles.percentageLabel}>Attendance</Text>
          <Text style={styles.percentageValue}>
            {studentData.attendancePercentage}%
          </Text>
        </View>
        <View style={[styles.percentageBox, {backgroundColor: '#faebf0'}]}>
          <Text style={styles.percentageLabel}>Avg. Score</Text>
          <Text style={styles.percentageValue}>
            {studentData.marksPercentage}%
          </Text>
        </View>
        <View style={[styles.percentageBox, {backgroundColor: '#f6f4dd'}]}>
          <Text style={styles.percentageLabel}>Fee Due</Text>
          <Text style={styles.percentageValue}>20%</Text>
        </View>
      </View>
      <View style={styles.tableContainer}>
        <View style={styles.tableRow}>
          <Text style={styles.tableLabel}>Roll No</Text>
          <Text style={styles.tableValue}>{studentData.rollNo}</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableLabel}>Birthdate</Text>
          <Text style={styles.tableValue}>{studentData.dateOfBirth}</Text>
        </View>

        <View style={styles.tableRow}>
          <Text style={styles.tableLabel}>Blood Group</Text>
          <Text style={styles.tableValue}>{studentData.bloodGroup}</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableLabel}>Caste</Text>
          <Text style={styles.tableValue}>{studentData.caste}</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableLabel}>Religion</Text>
          <Text style={styles.tableValue}>{studentData.religion}</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableLabel}>Nationality</Text>
          <Text style={styles.tableValue}>{studentData.nationality}</Text>
        </View>
        {/* Add other information rows dynamically */}
      </View>
      <View style={styles.tableContainer}>
        <View style={styles.tableRow}>
          <Text style={styles.tableLabel}>Contact Information</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableLabel}>Father Name</Text>
          <Text style={styles.tableValue}>{studentData.fatherName}</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableLabel}>Mobile No</Text>
          <TouchableOpacity
            onPress={() => handleLinkPress(studentData.parentNumber)}>
            <Text
              style={[
                styles.tableValue,
                {color: 'blue', textDecorationLine: 'underline'},
              ]}>
              {studentData.parentNumber}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.tableRow}>
          <Text style={styles.tableLabel}>Mother Name</Text>
          <Text style={styles.tableValue}>{studentData.motherName}</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableLabel}>Mobile No</Text>
          <TouchableOpacity
            onPress={() =>
              Linking.openURL(`tel:${studentData.parentNumberSecond}`)
            }>
            <Text
              style={[
                styles.tableValue,
                {color: 'blue', textDecorationLine: 'underline'},
              ]}>
              {studentData.parentNumberSecond}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.tableContainer}>
        <View style={styles.tableRow}>
          <Text style={styles.tableLabel}>Address</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableValue}>{studentData.address}</Text>
        </View>
      </View>
      {/* <View style={[styles.tableContainer, {marginBottom: 50}]}>
        <TouchableOpacity onPress={handlePress}>
          <View style={styles.tableRow}>
            <Text style={styles.tableLabel}>First Term Exam Result</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Ionicons
                name="time-outline"
                size={16}
                color="#3498db"
                style={styles.timeIcon}
              />
              <Text style={styles.tableValue}>12 Jan, 2023</Text>
            </View>
            <Ionicons
              name="chevron-forward-outline"
              size={16}
              color="#3498db"
            />
          </View>
        </TouchableOpacity>
      </View> */}
      {/* Dynamically render test list */}
      {testList.map((test, index) => (
        <TouchableOpacity
          key={test.testId} // Use a unique identifier as the key
          onPress={() => handleTestPress(test.testId)}>
          <View
            style={[
              styles.tableContainer,
              index === testList.length - 1 && {marginBottom: 50},
            ]}>
            <View style={styles.tableRow}>
              <Text style={styles.tableLabel}>Test: {test.testName}</Text>
              <Ionicons
                name="chevron-forward-outline"
                size={16}
                color="#3498db"
              />
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff', // White background color
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageContainer: {},
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  profileInfo: {
    // marginTop: -20,
    marginLeft: 5,
  },
  name: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 5,
  },
  major: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  university: {
    fontSize: 14,
    color: '#777',
    marginBottom: 10,
  },
  percentageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  percentageBox: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 10,
    margin: 5,
    alignItems: 'center',
    elevation: 3,
  },
  percentageLabel: {
    fontSize: 12,
    color: '#555',
    marginBottom: 5,
  },
  percentageValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  tableContainer: {
    marginTop: 20,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    elevation: 3,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
  },
  tableLabel: {
    fontSize: 14,
    color: '#555',
    fontWeight: 'bold',
  },
  tableValue: {
    fontSize: 14,
    color: '#333',
  },
  addressContainer: {
    marginBottom: 20,
  },
  addressLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  addressValue: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
});

export default StudentInfoScreen;
