import React, {useState, useEffect} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import {
  View,
  Text,
  FlatList,
  Switch,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getData, postData} from '../services/commonService';
import RNDateTimePicker from '@react-native-community/datetimepicker';

const AddAttendanceScreen = ({navigation, route}) => {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [students, setStudents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const {disabledDates} = route.params || {};
  console.log(disabledDates);

  const showDatePickerIfNeeded = () => {
    if (!route.params?.date && showDatePicker) {
      console.log('showDatePicker');
      setShowDatePicker(true);
    }
  };
  useEffect(() => {
    async function fetchAttendanceData() {
      try {
        const classId = await AsyncStorage.getItem('classId');
        const divId = await AsyncStorage.getItem('divId');
        const authToken = await AsyncStorage.getItem('authToken');

        if (route.params?.date) {
          console.log(route.params.date);
          const dateOnly = route.params.date;

          const queryParams = {
            classId,
            divId,
            date: dateOnly,
          };

          const responseData = await getData(
            'addattendancestudentlist',
            queryParams,
          );

          if (responseData && responseData.length > 0) {
            const updatedStudents = responseData.map(student => ({
              ...student,
              attendanceResult:
                student.attendanceResult.toLowerCase() === 'true',
            }));
            console.log('updatedStudents');
            console.log(updatedStudents);
            setStudents(updatedStudents);
          } else {
            if (!showDatePicker) {
              showDatePickerIfNeeded();
            }
          }
        } else if (route.params?.editdate) {
          // Call your getbyrecord API here
          const editDateOnly = route.params.editdate;
          const queryParams = {
            classId,
            divId,
            date: editDateOnly,
          };

          const responseData = await getData('getbyrecord', queryParams);

          const updatedStudents = responseData.attendancestudentList.reduce(
            (acc, student) => {
              const {
                studentId,
                attendanceDate,
                attendanceResult,
                divId,
                id,
                classId,
                classTeacherId,
              } = student;
              const {rollNo, firstName, lastName} = student.AttendanceStudent;
              const studentName = `${firstName} ${lastName}`;
              const className = student.AttendanceClass.className;
              const divName = student.AttendanceDivision.divName;

              acc.push({
                studentId,
                attendanceDate,
                attendanceResult,
                divId,
                id,
                classId,
                classTeacherId,
                rollNo,
                studentName,
                className,
                divName,
              });

              return acc;
            },
            [],
          );
          setStudents(updatedStudents);
        } else {
          if (!showDatePicker) {
            setShowDatePicker(true);
            showDatePickerIfNeeded();
          }
        }
      } catch (error) {
        console.error('Error fetching attendance data:', error);
      }
    }

    fetchAttendanceData();
  }, [selectedDate, route.params?.date, showDatePicker]);

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
        setShowSuccessModal(true);
      }

      setStudents([]);
      setShowDatePicker(false);
    } catch (error) {
      console.error('Error in handleSubmit:', error);
    }
  };

  const handleCancel = () => {
    navigation.navigate('Attendancelist');
    setStudents([]);
    setShowDatePicker(false);
  };

  const renderStudentItem = ({item}) => (
    <TouchableOpacity
      style={[
        styles.studentItem,
        {
          elevation: 3,
          color: item.attendanceResult ? '#152848' : '#63316e',
          backgroundColor: item.attendanceResult ? '#ddf4e2' : '#faebf0',
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
          style={[styles.button, {backgroundColor: '#3498db', flex: 1}]}
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
          disabledDates={disabledDates.map(date => new Date(date))}
        />
      )}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showSuccessModal}
        onRequestClose={() => {
          setShowSuccessModal(false);
          navigation.navigate('Attendancelist', {reload: true});
        }}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              {route.params?.date
                ? 'Attendance records added successfully!'
                : 'Attendance records updated successfully!'}
            </Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setShowSuccessModal(false);
                navigation.navigate('Attendancelist', {reload: true});
              }}>
              <Text style={styles.modalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#603F8B',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default AddAttendanceScreen;
