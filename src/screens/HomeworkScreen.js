// Import necessary components and libraries
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  useWindowDimensions,
  ScrollView,
} from 'react-native';
import {
  Provider,
  TextInput,
  Button,
  DefaultTheme,
  Snackbar,
} from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Picker} from '@react-native-picker/picker';
import {FAB} from 'react-native-paper';
import HTML from 'react-native-render-html';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  getData,
  postData,
  deleteData,
  putData,
} from '../services/commonService';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Main component
const HomeworkScreen = () => {
  const [fabVisible, setFabVisible] = useState(true);
  const [homeworks, setHomeworks] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [editHomework, setEditHomework] = useState(null); // Track the homework being edited
  const [newHomework, setNewHomework] = useState({
    id: '',
    title: '',
    description: '',
    deadline: '',
    classId: '',
    divId: '',
    subId: '',
    className: '',
    divName: '',
    subName: '',
  });
  const [data, setData] = useState([]);
  const {width: contentWidth} = useWindowDimensions();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleteHomeworkId, setDeleteHomeworkId] = useState(null);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // Function to fetch teacher's homework list on page load
  useEffect(() => {
    const fetchTeacherHomeworkList = async () => {
      try {
        const teacherId = await AsyncStorage.getItem('teacherId');
        const queryParams = {teacherId};
        const response = await getData('getteacherhomeworklist', queryParams);

        if (response && response) {
          setHomeworks(response);
        }
      } catch (error) {
        console.error('Error fetching teacher homework list:', error);
      }
    };

    // Call the function to fetch teacher's homework list
    fetchTeacherHomeworkList();

    const fetchTeacherData = async () => {
      const teacherId = await AsyncStorage.getItem('teacherId');

      try {
        const queryParams = {teacherId};
        const response = await getData('teachersubjectclasslist', queryParams);
        setData(response.classdivlist);
      } catch (error) {
        console.error('Error fetching teacher data:', error);
      }
    };

    fetchTeacherData();
  }, []);

  const openEditModal = homework => {
    setEditHomework(homework);
    setNewHomework({
      id: homework.id,
      title: homework.title,
      description: homework.description,
      deadline: homework.deadline,
      classId: homework.classId,
      divId: homework.divId,
      subId: homework.subId,
      className: homework.className,
      divName: homework.divName,
      subName: homework.subName,
    });
    toggleModal();
  };

  // Function to open the delete confirmation modal
  const openDeleteModal = homeworkId => {
    setDeleteHomeworkId(homeworkId);
    setDeleteModalVisible(true);
  };

  // Function to handle delete confirmation
  const handleDeleteConfirmation = async () => {
    try {
      const response = await deleteData('homework/' + deleteHomeworkId);

      if (response.success) {
        setHomeworks(
          homeworks.filter(homework => homework.id !== deleteHomeworkId),
        );
        setSnackbarMessage('Homework successfully deleted!');
        setSnackbarVisible(true);
      }

      // Close the delete confirmation modal
      setDeleteModalVisible(false);
    } catch (error) {
      console.error('Error deleting homework:', error);
      // Handle error, show message to the user, etc.
    }
  };

  // Function to toggle modal visibility
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  // Function to handle date change in date picker
  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setNewHomework({...newHomework, deadline: selectedDate.toISOString()});
    }
  };

  // Function to handle adding or updating homework
  const handleAddHomework = async () => {
    try {
      const teacherId = await AsyncStorage.getItem('teacherId');
      const HomeworkData = {
        title: newHomework.title,
        description: newHomework.description,
        deadline: newHomework.deadline,
        classId: newHomework.classId,
        divId: newHomework.divId,
        subId: newHomework.subId,
        teacherId: teacherId,
      };

      let response;
      if (editHomework) {
        // If in edit mode, update the homework
        response = await putData('homework/' + editHomework.id, HomeworkData);
        console.log('editresponse');
        console.log(response);
        if (response.success) {
          // Update the homeworks list by replacing the edited homework
          setHomeworks(
            homeworks.map(homework =>
              homework.id === editHomework.id ? newHomework : homework,
            ),
          );
          setSnackbarMessage('Homework successfully updated!');
        }
      } else {
        // If in add mode, add a new homework
        response = await postData('homework', HomeworkData);
        if (response.success) {
          // Add the new homework to the list
          setHomeworks([...homeworks, response.data]);
          setSnackbarMessage('Homework successfully added!');
        }
      }

      setNewHomework({
        id: '',
        title: '',
        description: '',
        deadline: '',
        className: '',
        divName: '',
        subName: '',
      });

      // Close the modal
      setModalVisible(false);
      setSnackbarVisible(true);
    } catch (error) {
      console.error('Error handling homework:', error);
      // Handle the error, show a message to the user, etc.
    }
  };

  // ...

  return (
    <Provider theme={theme}>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <View style={styles.container}>
          {/* Homework List */}
          {homeworks.map(item => (
            <View key={item.id} style={styles.homeworkItem}>
              <View style={styles.homeworkHeader}>
                <Text style={styles.text}>
                  {item.subName} {item.className}-{item.divName}
                </Text>
                <View style={styles.iconContainer}>
                  <TouchableOpacity onPress={() => openEditModal(item)}>
                    <Ionicons
                      name="create-outline"
                      size={18}
                      color="#3498db"
                      style={styles.icon}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => openDeleteModal(item.id)}>
                    <Ionicons
                      name="trash-outline"
                      size={18}
                      color="#e74c3c"
                      style={styles.icon}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <Text style={styles.class}>{item.title}</Text>
              <Text style={styles.description}>
                <HTML
                  source={{html: item.description}}
                  contentWidth={contentWidth}
                />
              </Text>
              <Text style={styles.date}>{item.deadline}</Text>
            </View>
          ))}

          {/* Modal for Adding or Editing Homework */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={isModalVisible}
            onRequestClose={toggleModal}>
            <View style={styles.modalContainer}>
              <View style={styles.headerContainer}>
                <Text style={styles.modalHeader}>
                  {editHomework ? 'Edit Homework' : 'Give Homework'}
                </Text>
                <TouchableOpacity onPress={toggleModal}>
                  <Ionicons name="close-outline" size={30} color="#000" />
                </TouchableOpacity>
              </View>

              <Picker
                style={styles.picker}
                selectedValue={newHomework.class}
                onValueChange={(itemValue, itemIndex) => {
                  const selectedItem = data[itemIndex];
                  if (selectedItem) {
                    setNewHomework({
                      ...newHomework,
                      class: itemValue,
                      className: selectedItem.className,
                      classId: selectedItem.classId,
                      divName: selectedItem.divName,
                      divId: selectedItem.divId,
                      subName: selectedItem.subName,
                      subId: selectedItem.subId,
                    });
                  }
                }}>
                <Picker.Item label="Select Class Subject" value="" />
                {data.map(item => (
                  <Picker.Item
                    key={`${item.subName}-${item.className}-${item.divName}`}
                    label={`${item.subName} ${item.className}-${item.divName}`}
                    value={`${item.className}-${item.divName}`}
                  />
                ))}
              </Picker>
              <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                <View style={styles.datePickerContainer}>
                  <Text style={styles.inputLabel}>Due Date</Text>
                  <Text>{newHomework.deadline}</Text>
                </View>
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={new Date()}
                  mode="date"
                  display="default"
                  onChange={onDateChange}
                />
              )}
              <TextInput
                label="Homework Text"
                value={newHomework.title}
                onChangeText={title => setNewHomework({...newHomework, title})}
                style={styles.input}
              />
              <TextInput
                label="Description"
                value={newHomework.description}
                onChangeText={description =>
                  setNewHomework({...newHomework, description})
                }
                multiline={true}
                numberOfLines={4}
                style={styles.textarea}
              />

              <Button
                style={
                  newHomework.class &&
                  newHomework.title &&
                  newHomework.description &&
                  newHomework.deadline
                    ? styles.addButtonEnabled
                    : styles.addButtonDisabled
                }
                mode="contained"
                onPress={handleAddHomework}
                disabled={
                  !newHomework.class ||
                  !newHomework.title ||
                  !newHomework.description ||
                  !newHomework.deadline
                }>
                {editHomework ? 'Update Homework' : 'Add Homework'}
              </Button>
            </View>
          </Modal>

          {/* Delete Confirmation Modal */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={isDeleteModalVisible}
            onRequestClose={() => setDeleteModalVisible(false)}>
            <View style={styles.modalContainerDelete}>
              <Text style={styles.modalHeader}>Confirm Deletion</Text>
              <Text>Are you sure you want to delete this homework?</Text>
              <Button
                style={styles.addButtonEnabled}
                mode="contained"
                onPress={handleDeleteConfirmation}>
                Yes, Delete
              </Button>
              <Button
                style={styles.addButtonDisabled}
                mode="contained"
                onPress={() => setDeleteModalVisible(false)}>
                Cancel
              </Button>
            </View>
          </Modal>

          {/* Snackbar for showing messages */}
          <Snackbar
            visible={snackbarVisible}
            onDismiss={() => setSnackbarVisible(false)}
            duration={3000}>
            {snackbarMessage}
          </Snackbar>
        </View>
      </ScrollView>
      {/* FAB (Floating Action Button) */}
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => {
          toggleModal();
          // Reset the form fields
          setNewHomework({
            id: '',
            title: '',
            description: '',
            deadline: '',
            classId: '',
            divId: '',
            subId: '',
            className: '',
            divName: '',
            subName: '',
          });
        }}
        visible={fabVisible}
      />
    </Provider>
  );
};

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#3498db',
    accent: '#ff6347',
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    padding: 20,
    backgroundColor: '#fff',
    color: '#000',
  },
  scrollViewContainer: {
    flexGrow: 1, // Important to enable scrolling
  },
  homeworkItem: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    elevation: 3,
    position: 'relative', // Make the container relative for absolute positioning of icons
  },
  homeworkHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconContainer: {
    flexDirection: 'row',
  },
  icon: {
    marginLeft: 10,
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  date: {
    color: '#777',
  },
  class: {
    color: '#555',
    marginTop: 5,
    fontSize: 14,
    fontWeight: 'bold',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  description: {
    color: '#000',
  },
  modalContainerDelete: {
    width: '80%',
    alignSelf: 'center', // Center horizontally
    justifyContent: 'center', // Try changing to 'center' or 'space-between'
    padding: 20,
    marginTop: '60%',
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 5,
  },
  modalContainer: {
    width: '80%',
    height: 500, // Set a fixed height or adjust as needed
    alignSelf: 'center', // Center horizontally
    justifyContent: 'space-between', // Try changing to 'center' or 'space-between'
    padding: 20,
    marginTop: 100,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 5,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  modalHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  picker: {
    marginBottom: 10,
    backgroundColor: '#ecf0f1', // Set your background color for the dropdown
    borderRadius: 5,
    paddingHorizontal: 10,
  },

  input: {
    marginBottom: 10,
    backgroundColor: '#ecf0f1',
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  addButton: {
    marginTop: 10,
    backgroundColor: '#3498db',
  },
  addButtonEnabled: {
    marginTop: 10,
    backgroundColor: '#3498db',
  },
  addButtonDisabled: {
    marginTop: 10,
    backgroundColor: '#bdc3c7',
  },
  textarea: {
    height: 100,
    textAlignVertical: 'top',
    marginBottom: 10,
    backgroundColor: '#ecf0f1',
  },
  datePickerContainer: {
    marginBottom: 10,
    backgroundColor: '#ecf0f1', // Set your background color for the date picker container
    borderRadius: 5,
    padding: 10,
  },
});

export default HomeworkScreen;
