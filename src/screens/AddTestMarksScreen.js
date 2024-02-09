import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Button,
  TextInput,
} from 'react-native';
import {postData} from '../services/commonService';
import Modal from 'react-native-modal';

const AddTestMarksScreen = ({route, navigation}) => {
  const {isEditMode, testMarksData} = route.params || {
    isEditMode: false,
    testMarksData: null,
  };

  const [students, setStudents] = useState([
    {id: 1, studentName: 'John Doe', getMarks: 0},
    {id: 2, studentName: 'Jane Smith', getMarks: 0},
    {id: 3, studentName: 'Bob Johnson', getMarks: 0},
    // Add more students as needed
  ]);

  const [totalMarks, setTotalMarks] = useState(100);
  const [isConfirmationVisible, setIsConfirmationVisible] = useState(false);

  useEffect(() => {
    // If in edit mode, update the state with the existing data
    if (isEditMode && testMarksData) {
      setTotalMarks(testMarksData[0].totalMarks || 100);
      setStudents(testMarksData);
    }
  }, [isEditMode, testMarksData]);

  const handleMarksChange = (id, marks) => {
    setStudents(prevStudents =>
      prevStudents.map(student =>
        student.id === id
          ? {...student, getMarks: Math.min(marks, totalMarks)}
          : student,
      ),
    );
  };

  const handleTotalMarksChange = marks => {
    setTotalMarks(marks);
  };

  const handleConfirmation = () => {
    setIsConfirmationVisible(true);
  };

  const handleConfirmationClose = () => {
    setIsConfirmationVisible(false);
  };

  const handleConfirmationConfirm = async () => {
    // Omit columns from each student
    const updatedStudents = students.map(
      ({
        studentName,
        className,
        divName,
        rollNo,
        subName,
        teacherName,
        ...rest
      }) => rest,
    );
    try {
      const result = await postData('bulktestmarks', updatedStudents);
      // Call the bulktestmarks API with the updated data

      console.log('Bulk Test Marks API response:', result);

      // If in edit mode, navigate back to the previous screen
      if (isEditMode) {
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error submitting bulk test marks:', error);
      // Handle the error as needed
    }
    if (isEditMode) {
      navigation.goBack();
    }
    setIsConfirmationVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {isEditMode ? 'Edit Test Marks' : 'Add Test Marks'}
      </Text>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Total Marks:</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="Enter Total Marks"
            value={totalMarks.toString()}
            onChangeText={text => handleTotalMarksChange(parseInt(text) || 0)}
          />
        </View>
      </View>
      <FlatList
        data={students}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <View style={styles.studentItem}>
            <Text style={styles.studentInfo}>
              <Text style={styles.label}>Roll No:</Text> {item.rollNo} |{' '}
              <Text style={styles.label}>Name:</Text> {item.studentName}
            </Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              placeholder="Enter Marks Obtained"
              value={item.getMarks?.toString()}
              onChangeText={text =>
                handleMarksChange(item.id, parseInt(text) || 0)
              }
            />
          </View>
        )}
      />
      <View style={styles.formContainer}>
        <Button title="Submit" onPress={handleConfirmation} color="#3498db" />
      </View>

      {/* Confirmation Modal */}
      <Modal isVisible={isConfirmationVisible}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalText}>Are you sure you want to submit?</Text>
          <View style={styles.modalButtons}>
            <Button
              title="Cancel"
              onPress={handleConfirmationClose}
              color="#e74c3c"
            />
            <Button
              title="Confirm"
              onPress={handleConfirmationConfirm}
              color="#27ae60"
            />
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#3498db',
  },
  inputWrapper: {
    flex: 1,
    marginLeft: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    color: '#2c3e50',
    fontWeight: 'bold',
    textAlign: 'center',
    paddingTop: 16,
  },
  studentItem: {
    flexDirection: 'column',
    marginBottom: 16,
    // borderWidth: 1,
    backgroundColor: '#f0f0f0',
    // borderColor: '#3498db',
    padding: 12,
    borderRadius: 8,
  },
  studentInfo: {
    fontSize: 16,
    color: '#2c3e50',
  },
  input: {
    height: 40,
    // borderColor: '#3498db',
    borderWidth: 1,
    padding: 8,
    marginTop: 8,
    color: '#2c3e50',
    // width: "20",
  },
  formContainer: {
    marginTop: 16,
  },
  // Modal styles
  modalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});

export default AddTestMarksScreen;
