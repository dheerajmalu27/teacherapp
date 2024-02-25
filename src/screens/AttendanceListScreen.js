import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {Calendar} from 'react-native-calendars';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getData} from '../services/commonService';
import {FAB} from 'react-native-paper';
import BottomMenu from '../menu/BottomMenu';
const AttendanceListScreen = ({navigation, route}) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [attendanceData, setAttendanceData] = useState({});
  const [markedDates, setMarkedDates] = useState({});
  const [disabledDates, setDisabledDates] = useState([]);
  const [selectedDateAttendanceData, setSelectedDateAttendanceData] =
    useState(null);
  const [fabVisible, setFabVisible] = useState(true);
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const [currentDate, setCurrentDate] = useState(
    new Date().toISOString().split('T')[0],
  );
  const disabledDaysIndexes = [0]; // Disable Sundays

  // Function to fetch attendance data from API
  const fetchAttendanceData = async () => {
    try {
      const storedClassId = await AsyncStorage.getItem('classId');
      const storedDivId = await AsyncStorage.getItem('divId');

      // Simulated API call to fetch data
      const queryParams = {classId: storedClassId, divId: storedDivId};
      const response = await getData('getattendancelist', queryParams);
      console.log(response);
      // Parsing the response to extract dates and their attendance status
      const parsedData = {};
      response.forEach(item => {
        parsedData[item.selectedDate] = {
          present: item.totalPresent,
          absent: item.total - item.totalPresent,
          className: item.className,
          classId: item.classId,
          divName: item.divName,
          divId: item.divId,
          selectedDate: item.selectedDate,
        };
        const selectedDate = new Date(item.selectedDate);
        // if (selectedDate.getDay() === 0) {
        //   // Sunday check
        //   disabledDates.push(item.selectedDate);
        // }
      });

      // Set attendance data state
      setAttendanceData(parsedData);

      // Mark dates with attendance data and set their color to green
      const markedDates = {};
      Object.keys(parsedData).forEach(date => {
        markedDates[date] = {
          marked: true,
          dotColor: '#63316e',
          selected: true,
          selectedColor: '#faebf0',
        };
      });
      setMarkedDates(markedDates);
      setDisabledDates(disabledDates);
      // Check if today's date record is present and set calendar visibility accordingly
      const todayDateString = new Date().toISOString().split('T')[0];
      setIsCalendarVisible(true);
    } catch (error) {
      console.error('Error fetching attendance data:', error);
    }
  };

  useEffect(() => {
    fetchAttendanceData();
    // if (route.params?.reload) {
    //   fetchAttendanceData();
    // }
    // fetchAttendanceData();
  }, [route.params?.reload]);

  // Function to handle date selection
  const handleDateSelect = date => {
    setSelectedDate(date.dateString);
    if (attendanceData[date.dateString]) {
      setSelectedDateAttendanceData(attendanceData[date.dateString]);
    } else {
      // console.log(date.dateString);
      navigation.navigate('AddAttendance', {date: date.dateString});
    }
  };

  // Function to handle editing the attendance record
  const handleEdit = item => {
    // console.log('Edit item with ID:', item);
    navigation.navigate('AddAttendance', {editdate: item.selectedDate});
  };

  const handleDelete = item => {
    console.log('Delete item with ID:', item);
  };

  // Function to handle exporting to Excel
  const handleExportToExcel = item => {
    console.log('Exporting item to Excel:', item);
  };

  return (
    <View style={styles.container}>
      {isCalendarVisible && (
        <View style={styles.calendarContainer}>
          <Calendar
            disabledDaysIndexes={disabledDaysIndexes}
            maxDate={currentDate}
            onDayPress={handleDateSelect}
            markedDates={{
              ...markedDates,
              ...disabledDates.reduce((acc, date) => {
                acc[date] = {disabled: true};
                return acc;
              }, {}),
            }}
            theme={{
              calendarBackground: '#fff',
              textSectionTitleColor: '#b6c1cd',
              selectedDayBackgroundColor: '#194989',
              selectedDayTextColor: '#63316e',
              todayTextColor: '#00adf5',
              dayTextColor: '#2d4150',
              textDisabledColor: '#d9e1e8',
              dotColor: 'red',
              selectedDotColor: '#ffffff',
              arrowColor: '#63316e',
              monthTextColor: '#194989',
              indicatorColor: 'blue',
              textDayFontFamily: 'monospace',
              textMonthFontFamily: 'monospace',
              textDayHeaderFontFamily: 'monospace',
              textDayFontWeight: '300',
              textMonthFontWeight: 'bold',
              textDayHeaderFontWeight: '300',
              textDayFontSize: 16,
              textMonthFontSize: 16,
              textDayHeaderFontSize: 16,
            }}
          />
        </View>
      )}
      {selectedDateAttendanceData && (
        <View style={styles.attendanceContainer}>
          <Text style={styles.selectedDateText}>
            Attendance for {selectedDate}
          </Text>
          <View style={styles.dataContainer}>
            <Text style={styles.dataText}>
              Total Present: {selectedDateAttendanceData.present}
            </Text>
            <Text style={styles.dataText}>
              Total Absent: {selectedDateAttendanceData.absent}
            </Text>
          </View>
          {/* Edit, Delete, and Export to Excel buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.editButton]}
              onPress={() => handleEdit(selectedDateAttendanceData)}>
              <MaterialCommunityIcons name="pencil" size={20} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.deleteButton]}
              onPress={() => handleDelete(selectedDateAttendanceData)}>
              <MaterialCommunityIcons name="delete" size={20} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.exportButton]}
              onPress={() => handleExportToExcel(selectedDateAttendanceData)}>
              <MaterialCommunityIcons
                name="file-excel"
                size={20}
                color="#fff"
              />
            </TouchableOpacity>
          </View>
        </View>
      )}
      {/* <FAB
        style={styles.fab}
        icon="plus"
        onPress={() =>
          navigation.navigate('AddAttendance', {
            disabledDates: Object.keys(markedDates),
          })
        }
        visible={fabVisible}
      /> */}
      <BottomMenu navigation={navigation} route={route} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    // padding: 10,
  },
  calendarContainer: {
    // marginBottom: 20,
  },
  attendanceContainer: {
    position: 'absolute',
    bottom: 100, // Adjust this value as needed to leave space for the BottomMenu
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: '#faebf0',
    borderRadius: 5,
    elevation: 3,
  },
  selectedDateText: {
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#63316e',
  },
  dataContainer: {
    marginBottom: 10,
  },
  dataText: {
    color: '#63316e',
    marginBottom: 5,
  },
  buttonContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  button: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    marginBottom: 10,
  },
  editButton: {
    backgroundColor: '#3498db',
    elevation: 3,
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
    elevation: 3,
  },
  exportButton: {
    backgroundColor: '#27ae60',
    elevation: 3,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 60,
    zIndex: 1,
  },
});

export default AttendanceListScreen;
