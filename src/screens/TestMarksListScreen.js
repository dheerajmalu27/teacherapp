import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {
  DataTable,
  Searchbar,
  Button,
  IconButton,
  Provider,
} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';
import {getData, generateCsvFile, deleteData} from '../services/commonService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Modal from 'react-native-modal';
import BottomMenu from '../menu/BottomMenu';
import {FAB} from 'react-native-paper';
import {useRoute} from '@react-navigation/native'; // Import useRoute from react-navigation/native

const TestMarksListScreen = () => {
  const route = useRoute();
  const [fabVisible, setFabVisible] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [pageNumber, setPageNumber] = useState(0);
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedDivision, setSelectedDivision] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedItemToDelete, setSelectedItemToDelete] = useState(null);

  const itemsPerPage = 5;
  const navigation = useNavigation();

  useEffect(() => {
    const fetchData = async () => {
      const teacherId = await AsyncStorage.getItem('teacherId');

      try {
        const queryParams = {teacherId};
        const response = await getData('gettestmarkslist', queryParams);
        console.log(response);
        setData(response);
      } catch (error) {
        console.error('Error fetching test marks data:', error);
      }
    };

    fetchData();
  }, []);

  const handlePageChange = page => {
    setPageNumber(page);
  };

  const handleSearch = query => {
    setSearchQuery(query);
  };

  const renderPageNumbers = () => {
    const totalPages = Math.ceil(data.length / itemsPerPage);
    const pages = Array.from({length: totalPages}, (_, i) => i + 1);

    return (
      <View style={styles.pageNumbersContainer}>
        {pages.map(page => (
          <Button
            key={page}
            onPress={() => handlePageChange(page)}
            style={[
              styles.pageNumberButton,
              page === pageNumber + 1 && styles.activePage,
            ]}
            labelStyle={
              page === pageNumber + 1 ? styles.activePageText : undefined
            }>
            {page}
          </Button>
        ))}
      </View>
    );
  };

  const renderTable = () => {
    const filteredData = data.filter(
      item =>
        item.testName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.className.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.divName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.subName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.average.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.totalMarks.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    const startIndex = pageNumber * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    const slicedData = filteredData.slice(startIndex, endIndex);

    return (
      <DataTable style={styles.table}>
        <DataTable.Header>
          <DataTable.Title style={styles.headerCell}>
            Subject Test
          </DataTable.Title>
          <DataTable.Title style={styles.headerCell}>Class-Div</DataTable.Title>
          <DataTable.Title style={styles.headerCell}>Average</DataTable.Title>
          <DataTable.Title style={styles.headerCell}>Actions</DataTable.Title>
        </DataTable.Header>

        {slicedData.map((item, index) => (
          <DataTable.Row key={index}>
            <DataTable.Cell style={styles.cell}>
              {`${item.subName} - ${item.testName}`}
            </DataTable.Cell>
            <DataTable.Cell style={styles.cell}>
              {`${item.className}-${item.divName}`}
            </DataTable.Cell>
            <DataTable.Cell
              style={styles.cell}>{`${item.average}`}</DataTable.Cell>
            <DataTable.Cell style={styles.actionCell}>
              <TouchableOpacity
                onPress={() => handleEdit(item)}
                style={styles.iconButton}>
                <MaterialCommunityIcons
                  name="pencil"
                  size={25}
                  color="#3498db"
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleDelete(item)}
                style={[styles.iconButton, styles.deleteButton]}>
                <MaterialCommunityIcons
                  name="delete"
                  size={25}
                  color="#e74c3c"
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleExportToExcel(item)}
                style={styles.iconButton}>
                <MaterialCommunityIcons
                  name="file-excel"
                  size={25}
                  color="#27ae60"
                />
              </TouchableOpacity>
            </DataTable.Cell>
          </DataTable.Row>
        ))}
      </DataTable>
    );
  };

  const handleEdit = async item => {
    const queryParams = {
      teacherId: item.teacherId,
      classId: item.classId,
      divId: item.divId,
      testId: item.testId,
      subId: item.subId,
    };
    const response = await getData('getbyrecordtestmarks', queryParams);
    console.log('testmarksstudentlist');

    const testMarksData = response.testmarksstudentlist.map(item => ({
      subName: item.TestmarksSubject.subName,
      testName: item.TestmarksTest.testName,
      className: item.TestmarksClass.className,
      divName: item.TestmarksDivision.divName,
      rollNo: item.TestmarksStudent.rollNo,
      studentName: `${item.TestmarksStudent.firstName} ${item.TestmarksStudent.lastName}`,
      teacherName: `${item.TestmarksTeacher.firstName} ${item.TestmarksTeacher.lastName}`,
      classId: item.classId,
      divId: item.divId,
      subId: item.subId,
      testId: item.testId,
      id: item.id,
      teacherId: item.teacherId,
      getMarks: item.getMarks,
      totalMarks: item.totalMarks,
    }));

    // Implement edit logic here
    navigation.navigate('AddTestMarks', {isEditMode: true, testMarksData});
  };

  const handleDelete = item => {
    setSelectedItemToDelete(item);
    setDeleteModalVisible(true);
  };

  const handleDeleteConfirm = async () => {
    // Implement delete logic here
    console.log('Delete item:', selectedItemToDelete);

    if (selectedItemToDelete) {
      try {
        const response = await deleteData(
          'testmarks/' +
            selectedItemToDelete.classId +
            '/' +
            selectedItemToDelete.divId +
            '/' +
            selectedItemToDelete.testId +
            '/' +
            selectedItemToDelete.subId,
        );

        const queryParams = {teacherId: selectedItemToDelete.teacherId};
        const updatedData = await getData('gettestmarkslist', queryParams);
        setData(updatedData);

        setSelectedItemToDelete(null);
      } catch (error) {
        console.error('Error deleting item:', error);
      }
    }

    setDeleteModalVisible(false);
  };

  const navigateToAddTestMarks = () => {
    setShowModal(true);
  };

  const handleExportToExcel = async item => {
    try {
      const queryParams = {
        teacherId: item.teacherId,
        classId: item.classId,
        divId: item.divId,
        testId: item.testId,
        subId: item.subId,
      };
      const response = await getData('getbyrecordtestmarks', queryParams);
      console.log('testmarksstudentlist');

      console.log(response.testmarksstudentlist);

      const transformedArray = response.testmarksstudentlist.map(item => ({
        subName: item.TestmarksSubject.subName,
        testName: item.TestmarksTest.testName,
        className: item.TestmarksClass.className,
        divName: item.TestmarksDivision.divName,
        rollNo: item.TestmarksStudent.rollNo,
        studentName: `${item.TestmarksStudent.firstName} ${item.TestmarksStudent.lastName}`,
        teacherName: `${item.TestmarksTeacher.firstName} ${item.TestmarksTeacher.lastName}`,
        getMarks: item.getMarks,
        totalMarks: item.totalMarks,
      }));
      const filename =
        item.subName +
        '-' +
        item.className +
        '-' +
        item.divName +
        '-' +
        item.testName +
        '-marks';
      const filePath = await generateCsvFile(filename, transformedArray);
    } catch (error) {
      console.error('Error exporting to Excel:', error);
    }
  };

  const handleSubmit = () => {
    // Perform actions with selected values
    console.log('Selected Class:', selectedClass);
    console.log('Selected Division:', selectedDivision);
    console.log('Selected Subject:', selectedSubject);

    // Close the modal after submission
    setShowModal(false);
  };

  return (
    <Provider>
      <ScrollView style={styles.container}>
        <Searchbar
          placeholder="Search"
          onChangeText={handleSearch}
          value={searchQuery}
          style={styles.searchBar}
        />
        {renderTable()}
        {renderPageNumbers()}

        <FAB
          style={styles.fab}
          icon="plus"
          onPress={() => setShowModal(true)}
          visible={fabVisible}
        />

        {/* Delete Confirmation Modal */}
        <Modal
          isVisible={isDeleteModalVisible}
          animationIn="slideInUp"
          animationOut="slideOutDown"
          onBackdropPress={() => setDeleteModalVisible(false)}
          backdropColor="transparent"
          backdropOpacity={0.1}
          style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Confirm Delete</Text>
            <Text style={styles.modalText}>
              Are you sure you want to delete this item?
            </Text>
            <View style={styles.rowContainer}>
              <Button
                mode="contained"
                onPress={handleDeleteConfirm}
                style={styles.button}>
                Confirm
              </Button>
              <Button
                mode="outlined"
                onPress={() => setDeleteModalVisible(false)}
                style={styles.button}>
                Cancel
              </Button>
            </View>
          </View>
        </Modal>

        <Modal visible={showModal} animationType="slide" transparent>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              {/* Close icon */}
              <IconButton
                icon={() => (
                  <MaterialCommunityIcons
                    name="close"
                    size={24}
                    color="#e74c3c"
                  />
                )}
                onPress={() => setShowModal(false)}
                style={styles.closeIcon}
              />

              {/* Modal Content */}
              <Text style={styles.modalHeader}>Add Test Marks</Text>
              <View style={styles.rowContainer}>
                <Text style={styles.modalText}>Select Class:</Text>
                <Picker
                  selectedValue={selectedClass}
                  onValueChange={itemValue => setSelectedClass(itemValue)}
                  style={styles.dropdown}>
                  <Picker.Item label="Select Class" value={null} />
                  {/* Add class options here */}
                </Picker>
              </View>
              <View style={styles.rowContainer}>
                <Text style={styles.modalText}>Select Division:</Text>
                <Picker
                  selectedValue={selectedDivision}
                  onValueChange={itemValue => setSelectedDivision(itemValue)}
                  style={styles.dropdown}>
                  <Picker.Item label="Select Division" value={null} />
                  {/* Add division options here */}
                </Picker>
              </View>
              <View style={styles.rowContainer}>
                <Text style={styles.modalText}>Select Subject:</Text>
                <Picker
                  selectedValue={selectedSubject}
                  onValueChange={itemValue => setSelectedSubject(itemValue)}
                  style={styles.dropdown}>
                  <Picker.Item label="Select Subject" value={null} />
                  {/* Add subject options here */}
                </Picker>
              </View>
              <View style={styles.rowContainer}>
                {/* Submit and Cancel Buttons */}
                <Button
                  mode="contained"
                  onPress={handleSubmit}
                  style={styles.button}>
                  Submit
                </Button>
                <Button
                  mode="outlined"
                  onPress={() => setShowModal(false)}
                  style={styles.button}>
                  Cancel
                </Button>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
      {/* <BottomMenu navigation={navigation} route={route} /> */}
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // Light Blue Background
  },
  searchBar: {
    marginVertical: 16,
    backgroundColor: '#ecf0f1', // Light Gray Background
  },
  pageNumbersContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 16,
  },
  pageNumberButton: {
    marginHorizontal: 1,
    backgroundColor: '#3498db', // Blue Button
  },
  activePage: {
    backgroundColor: '#2980b9', // Darker Blue for Active Page
  },
  activePageText: {
    // color: 'white',
  },
  table: {
    borderRadius: 8,
    // overflow: 'hidden',
    // backgroundColor: 'white', // White Table Background
  },
  headerCell: {
    flex: 1,
    justifyContent: 'center',
    color: 'black', // Set text color to black
  },

  // For DataTable Cells
  cell: {
    flex: 2,
    justifyContent: 'center',
    flexDirection: 'row',
    color: 'black', // Set text color to black
  },

  actionCell: {
    flex: 2,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  addButton: {
    marginVertical: 16,
    alignSelf: 'center',
    backgroundColor: '#27ae60', // Green Add Button
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: 300,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: 'black', // Black Text
  },
  modalText: {
    fontSize: 16,
    marginRight: 10,
    color: 'black', // Black Text
  },
  dropdown: {
    height: 50,
    width: 150,
    backgroundColor: 'white',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  button: {
    marginTop: 10,
    backgroundColor: '#27ae60', // Green Button
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default TestMarksListScreen;
