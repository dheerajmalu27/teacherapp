import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Modal,
} from 'react-native';
import {FAB} from 'react-native-paper';
import {Button, IconButton, Provider} from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation, useRoute} from '@react-navigation/native';
import BottomMenu from '../menu/BottomMenu';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getData} from '../services/commonService';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
const dummyData = [
  {id: 1, date: '2023-01-01', present: true},
  {id: 2, date: '2023-01-02', present: false},
  // Add more dummy data as needed
];

const AttendanceListScreen = () => {
  const [fabVisible, setFabVisible] = useState(true);
  const navigation = useNavigation();
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [classId, setClassId] = useState(null);
  const [divId, setDivId] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch classId and divId from AsyncStorage
        const storedClassId = await AsyncStorage.getItem('classId');
        const storedDivId = await AsyncStorage.getItem('divId');

        // Set classId and divId in component state
        setClassId(storedClassId);
        setDivId(storedDivId);

        // Simulated API call to fetch data
        const queryParams = {classId: storedClassId, divId: storedDivId};
        const response = await getData('getattendancelist', queryParams);
        console.log(response);
        // Assuming response.data contains the attendance list
        setData(response);
      } catch (error) {
        console.error('Error fetching attendance list:', error);
      }
    };

    fetchData();
  }, []); // Empty dependency array to run this effect only once on component mount

  useEffect(() => {
    setFilteredData(
      data.filter(item =>
        item.selectedDate.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    );
  }, [searchQuery, data]);
  const route = useRoute();
  const handleLoadMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  const handleEdit = id => {
    console.log('Edit item with ID:', id);
  };

  const handleDelete = id => {
    console.log('Delete item with ID:', id);
  };

  const handleExportToExcel = item => {
    console.log('Exporting item to Excel:', item);
  };

  const renderItem = ({item}) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.selectedDate}</Text>
      <Text style={styles.cell}>
        {item.totalPresent}/{item.total}
      </Text>
      <View style={styles.actionButtons}>
        <TouchableOpacity
          onPress={() => handleEdit(item)}
          style={styles.iconButton}>
          <MaterialCommunityIcons name="pencil" size={25} color="#3498db" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleDelete(item)}
          style={[styles.iconButton, styles.deleteButton]}>
          <MaterialCommunityIcons name="delete" size={25} color="#e74c3c" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleExportToExcel(item)}
          style={styles.iconButton}>
          <MaterialCommunityIcons name="file-excel" size={25} color="#27ae60" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderModal = () => (
    <Modal visible={showModal} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <IconButton
            icon={() => <Ionicons name="ios-close" size={30} color="#e74c3c" />}
            onPress={() => setShowModal(false)}
            style={styles.closeIcon}
          />
          <Text style={styles.modalHeader}>Your Modal Content Here</Text>
        </View>
      </View>
    </Modal>
  );

  return (
    <Provider>
      <View style={styles.container}>
        <View style={styles.filterContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by date..."
            placeholderTextColor="#777"
            value={searchQuery}
            onChangeText={text => setSearchQuery(text)}
          />
        </View>
        <View style={styles.header}>
          <Text style={styles.headerText}>Date</Text>
          <Text style={styles.headerText}>Attendance</Text>
          <Text style={styles.headerText}>Actions</Text>
        </View>
        <FlatList
          data={filteredData}
          renderItem={renderItem}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.1}
        />
        <FAB
          style={styles.fab}
          icon="plus"
          onPress={() => navigation.navigate('AddAttendance')}
          visible={fabVisible}
        />

        {renderModal()}
      </View>
      <BottomMenu navigation={navigation} route={route} />
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff', // Set background color to white
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: '#f0f0f0', // Set background color to a light gray
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333', // Dark gray text color
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: '#aaa', // Light gray border color
    borderWidth: 1,
    marginRight: 8,
    paddingHorizontal: 8,
    borderRadius: 8,
    color: '#333', // Dark gray text color
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
    color: '#333', // Dark gray text color
  },
  actionButtons: {
    flexDirection: 'row',
  },
  iconButton: {
    margin: 1,
    padding: 1,
  },
  deleteButton: {
    marginLeft: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
    color: '#333',
  },
  closeIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default AttendanceListScreen;
