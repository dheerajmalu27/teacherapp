import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  BackHandler,
  Modal,
  Button,
  Alert,
} from 'react-native';
import {Calendar} from 'react-native-calendars';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import {useNavigation} from '@react-navigation/native';
import {
  getData,
  generateCsvFile,
  generateExcelFile,
} from '../services/commonService';
const AttendanceReportScreen = ({navigation}) => {
  //   const navigation = useNavigation();
  let months = [
    {name: 'January', color: '#5DADE2'},
    {name: 'February', color: '#F1948A'},
    {name: 'March', color: '#82E0AA'},
    {name: 'April', color: '#D7BDE2'},
    {name: 'May', color: '#F9E79F'},
    {name: 'June', color: '#A2D9CE'},
    {name: 'July', color: '#F5CBA7'},
    {name: 'August', color: '#85929E'},
    {name: 'September', color: '#5DADE2'},
    {name: 'October', color: '#F1948A'},
    {name: 'November', color: '#82E0AA'},
    {name: 'December', color: '#D7BDE2'},
  ];
  const [loading, setLoading] = useState(false);
  const [dateRangeModalVisible, setDateRangeModalVisible] = useState(false);
  const [selectedStartDate, setSelectedStartDate] = useState('');
  const [selectedEndDate, setSelectedEndDate] = useState('');
  const [monthsData, setMonthsData] = useState([]);
  const [schoolProfileData, setSchoolProfileData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const schoolData = await getData('schoolprofile');
        console.log('schoolData:', schoolData);
        const startDate = new Date(schoolData.schoolprofile[0].schoolStartDate);
        const endDate = new Date(schoolData.schoolprofile[0].schoolEndDate);
        setSchoolProfileData(schoolData.schoolprofile[0]);
        months = generateMonthList(startDate, endDate);
        setMonthsData(months);
      } catch (error) {
        console.error('Error fetching school profile:', error);
      }
    };

    fetchData(); // Call the fetchData function when the component mounts
  }, []); // Empty dependency array ensures the effect runs only once after initial render

  // Your component JSX and logic here
  const generateMonthList = (startDate, endDate) => {
    const monthsList = [];
    let currentDate = new Date(startDate);
    let colorIndex = 0;

    while (currentDate <= endDate) {
      const monthName = new Intl.DateTimeFormat('en', {month: 'long'}).format(
        currentDate,
      );
      const year = currentDate.getFullYear().toString().slice(2);
      const monthEntry = {
        name: `${monthName}-${year}`,
        color: months[colorIndex].color,
      };
      monthsList.push(monthEntry);

      // Move to the next month and cycle through colors
      currentDate.setMonth(currentDate.getMonth() + 1);
      colorIndex = (colorIndex + 1) % months.length;
    }

    return monthsList;
  };
  const handleDownloadExcel = async month => {
    try {
      // Show loading indicator while fetching data
      setLoading(true);

      // Get the current year
      const currentYear = new Date().getFullYear();

      // Convert month name to its corresponding number (e.g., January -> 0, February -> 1, etc.)
      const monthIndex = months.findIndex(item => item.name === month);

      // Calculate the start date for the specified month
      const startDate = new Date(currentYear, monthIndex, 1)
        .toISOString()
        .slice(0, 10);

      // Calculate the end date for the specified month
      const endDate = new Date(currentYear, monthIndex + 1, 0)
        .toISOString()
        .slice(0, 10);

      const classId = await AsyncStorage.getItem('classId');
      const divId = await AsyncStorage.getItem('divId');

      const queryParams = {
        classId,
        divId,
        startDate,
        endDate,
      };

      const responseData = await getData(
        'attendancedatewisereport',
        queryParams,
      );

      if (
        responseData &&
        responseData.attendancestudentList &&
        responseData.attendancestudentList.length > 0
      ) {
        // Sort the attendancestudentList array by rollNo in ascending order
        responseData.attendancestudentList.sort((a, b) => {
          return a.rollNo.localeCompare(b.rollNo);
        });
        const responseDataWithPercentage = calculatePercentage(
          responseData.attendancestudentList,
        );

        const filename = 'Attendance Report of Month ' + month;
        // const filePath = await generateCsvFile(
        //   filename,
        //   responseData.attendancestudentList,
        // );
        // const filename = `Attendance Report ${month}`;
        const schoolName =
          schoolProfileData.schoolName + '\n' + schoolProfileData.schoolAddress;
        const classDivision = 'Class 10A';
        const filePath1 = await generateExcelFile(
          filename,
          responseDataWithPercentage,
          schoolName,
          classDivision,
        );

        // Hide loading indicator when API call is complete
        setLoading(false);

        // Implement further logic for handling the API response, such as downloading the report
        console.log(`Downloading report for ${month}`);
      } else {
        // If no records found, display a message
        Alert.alert(
          'No Records Found',
          `No attendance records found for the month of ${month}.`,
        );
        // Hide loading indicator when no records found
        setLoading(false);
      }
    } catch (error) {
      console.error('Error handling download and API call:', error);
      // Hide loading indicator and handle errors appropriately
      setLoading(false);
    }
  };

  const calculatePercentage = attendanceList => {
    // Iterate through each student's attendance record
    return attendanceList.map(student => {
      // Count the total number of classes attended (P)
      const totalCount = Object.values(student).reduce((acc, value) => {
        if (value === 'P' || value === 'A') {
          acc++;
        }
        return acc;
      }, 0);

      // Count the total number of classes attended (P)
      const pCount = Object.values(student).reduce((acc, value) => {
        if (value === 'P') {
          acc++;
        }
        return acc;
      }, 0);

      // Calculate the percentage of P values against the total count
      const percentage = (pCount / totalCount) * 100;

      // Return the student object with the calculated percentage added at the end
      return {
        ...student,
        percentage: percentage.toFixed(2) + '%', // Add percentage symbol and round to 2 decimal places
      };
    });
  };

  const handleDateRangeConfirm = async () => {
    try {
      console.log(
        `Selected date range: ${selectedStartDate} to ${selectedEndDate}`,
      );

      const classId = await AsyncStorage.getItem('classId');
      const divId = await AsyncStorage.getItem('divId');

      const queryParams = {
        classId,
        divId,
        startDate: selectedStartDate,
        endDate: selectedEndDate,
      };

      const responseData = await getData(
        'attendancedatewisereport',
        queryParams,
      );

      if (
        responseData &&
        responseData.attendancestudentList &&
        responseData.attendancestudentList.length > 0
      ) {
        // Sort the attendancestudentList array by rollNo in ascending order
        responseData.attendancestudentList.sort((a, b) => {
          return a.rollNo.localeCompare(b.rollNo);
        });
        console.log(responseData.attendancestudentList);
        const responseDataWithPercentage = calculatePercentage(
          responseData.attendancestudentList,
        );

        const filename = `Attendance Report from ${selectedStartDate} to ${selectedEndDate}`;
        // const filePath = await generateCsvFile(
        //   filename,
        //   responseData.attendancestudentList,
        // );
        const schoolName = 'Your School';
        const classDivision = 'Class 10A';
        const filePath1 = await generateExcelFile(
          filename,
          responseDataWithPercentage,
          schoolName,
          classDivision,
        );

        // Hide loading indicator when API call is complete
        setLoading(false);
        setDateRangeModalVisible(false);
      } else {
        // If no records found, display a message
        Alert.alert(
          'No Records Found',
          'No attendance records were found for the selected date range.',
        );
      }
    } catch (error) {
      console.error('Error handling date range confirmation:', error);
      // Handle error appropriately
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Attendance Report Of Class 1st - A</Text>
      <TouchableOpacity
        style={styles.dateRangeButton}
        onPress={() => {
          setSelectedStartDate('');
          setSelectedEndDate('');
          setDateRangeModalVisible(true);
        }}>
        <Text style={styles.dateRangeButtonText}>Select Date Range</Text>
      </TouchableOpacity>
      <View style={styles.monthRow}>
        {monthsData.map((month, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.monthButton, {backgroundColor: month.color}]}
            onPress={() => handleDownloadExcel(month.name)}>
            <Text style={styles.monthButtonText}>{month.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={dateRangeModalVisible}
        onRequestClose={() => setDateRangeModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Date Range</Text>
            {/* Date range picker */}
            <Calendar
              onDayPress={day => {
                if (!selectedStartDate) {
                  setSelectedStartDate(day.dateString);
                } else {
                  setSelectedEndDate(day.dateString);
                }
              }}
              markingType={'period'}
              markedDates={{
                [selectedStartDate]: {startingDay: true, color: '#3498db'},
                [selectedEndDate]: {endingDay: true, color: '#3498db'},
              }}
            />
            <View style={styles.buttonContainer}>
              <Button title="Confirm" onPress={handleDateRangeConfirm} />
              <Button
                title="Cancel"
                onPress={() => setDateRangeModalVisible(false)}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000',
  },
  monthRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    width: '100%',
  },
  monthButton: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginBottom: 10,
    width: '48%',
    elevation: 3,
  },
  monthButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  dateRangeButton: {
    backgroundColor: '#3498db',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginBottom: 10,
    width: '100%',
    elevation: 3,
  },
  dateRangeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
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
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20, // Adjust this value as needed
  },
});

export default AttendanceReportScreen;
