import React, {useState, useEffect} from 'react';

import {
  View,
  Text,
  FlatList,
  Switch,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getData, postData} from '../services/commonService';
import RNDateTimePicker from '@react-native-community/datetimepicker';

const AddAttendanceScreen = ({navigation}) => {
  const [students, setStudents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    setShowDatePicker(true);
    // Fetch and set student data here if needed
  }, []);

  const handleCheckboxChange = id => {
    setStudents(prevStudents =>
      prevStudents.map(student =>
        student.studentId === id
          ? {...student, attendanceResult: !student.attendanceResult}
          : student,
      ),
    );
  };

  const handleDateChange = async (event, date) => {
    setShowDatePicker(false);

    console.log('Date selected:', date);
    setSelectedDate(date || new Date());

    const classId = await AsyncStorage.getItem('classId');
    const divId = await AsyncStorage.getItem('divId');

    try {
      const dateOnly = date.toISOString().slice(0, 10);
      const authToken = await AsyncStorage.getItem('authToken');

      const queryParams = {
        classId,
        divId,
        date: dateOnly,
      };

      const responseData = await getData(
        'addattendancestudentlist',
        queryParams,
      );

      console.log('API Response:', responseData);
      const updatedStudents = responseData.map(student => {
        const attendanceResult =
          student.attendanceResult.toLowerCase() === 'true';
        console.log(
          `Student ID ${student.studentId}: Attendance Result - ${attendanceResult}`,
        );
        return {...student, attendanceResult: attendanceResult};
      });

      setStudents(updatedStudents);
    } catch (error) {
      console.error('Error making API call:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      const studentsWithoutNamesAndClassDiv = students.map(
        ({studentName, className, divName, rollNo, ...rest}) => rest,
      );

      console.log(studentsWithoutNamesAndClassDiv);

      const response = await postData(
        'bulkattendance',
        studentsWithoutNamesAndClassDiv,
      );

      console.log('Bulk Attendance API Response:', response);
      if (response?.success) {
        navigation.navigate('Home');
      }

      setStudents([]);
      setShowDatePicker(false);
    } catch (error) {
      console.error('Error in handleSubmit:', error);
    }
  };

  const handleCancel = () => {
    setStudents([]);
    setShowDatePicker(false);
  };

  const renderStudentItem = ({item}) => (
    <TouchableOpacity
      style={[
        styles.studentItem,
        {
          backgroundColor: item.attendanceResult ? '#603F8B' : '#e74c3c',
        },
      ]}
      onPress={() => handleCheckboxChange(item.studentId)}>
      <Text style={styles.studentText}>{item.rollNo}</Text>
      <Text style={styles.studentText}>{item.studentName}</Text>
      <Switch
        value={item.attendanceResult}
        onValueChange={() => handleCheckboxChange(item.studentId)}
        trackColor={{
          false: '#767577',
          true: '#9388A2',
        }}
        thumbColor={item.attendanceResult ? '#fff' : '#f4f3f4'}
      />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Roll No</Text>
        <Text style={styles.headerText}>Student Name</Text>
        <Text style={styles.headerText}>P/A</Text>
      </View>
      <FlatList
        data={students}
        keyExtractor={item => item.studentId.toString()}
        renderItem={renderStudentItem}
      />
      <View style={styles.formContainer}>
        <TouchableOpacity
          style={[styles.button, {backgroundColor: '#e74c3c', flex: 1}]}
          onPress={handleCancel}>
          <Ionicons name="close-circle" size={24} color="white" />
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, {backgroundColor: '#603F8B', flex: 1}]}
          onPress={handleSubmit}>
          <Ionicons name="checkmark-circle" size={24} color="white" />
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </View>
      {showDatePicker && (
        <RNDateTimePicker
          value={selectedDate}
          mode="date"
          is24Hour={true}
          display="default"
          onChange={handleDateChange}
          maximumDate={new Date()}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,

    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  studentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    padding: 10,
    borderRadius: 5,
  },
  studentText: {
    color: 'white',
    fontSize: 14,
  },
  formContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 8,
  },
});

export default AddAttendanceScreen;
