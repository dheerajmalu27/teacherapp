import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Picker} from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getData, generateExcelFile} from '../services/commonService';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const TestReportScreen = () => {
  const navigation = useNavigation();
  const [selectedTest, setSelectedTest] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [tests, setTests] = useState([]);
  const [classes, setClasses] = useState([]);
  const [reportData, setReportData] = useState([]);
  const [viewType, setViewType] = useState('list'); // State to track view type (list or grid)
  const [activeView, setActiveView] = useState('list');
  useEffect(() => {
    const fetchData = async () => {
      try {
        // const schoolProfile = await getData('schoolprofile');
        // console.log('schoolProfile');
        // console.log(schoolProfile);
        const responseSubject = await getData('testlist');
        const teacherId = await AsyncStorage.getItem('teacherId');
        const queryParams = {teacherId};
        const responseClass = await getData('teacherclassdivlist', queryParams);
        if (responseSubject && responseSubject.test) {
          setTests(responseSubject.test);
        } else {
          Alert.alert('Error', 'Failed to fetch subjects from the server');
        }
        if (responseClass && responseClass.classdivlist) {
          const classDivisions = responseClass.classdivlist.map(item => ({
            classdivId: `${item.classId}-${item.divId}`,
            classdivName: `${item.className}-${item.divName}`,
          }));
          setClasses(classDivisions);
        } else {
          Alert.alert('Error', 'Failed to fetch classes from the server');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        Alert.alert('Error', 'An error occurred while fetching data');
      }
    };
    fetchData();
  }, []);

  const handleGenerateReport = async () => {
    console.log(selectedTest);
    console.log(selectedClass);
    if (selectedTest && selectedClass) {
      console.log('responseData1');
      const classIdDivIdArray = selectedClass.split('-');
      const classId = classIdDivIdArray[0];
      const divId = classIdDivIdArray[1];
      const queryParams = {
        classId,
        divId,
        testId: selectedTest,
      };
      const responseData = await getData(
        'gettestclassdivisionreportlist',
        queryParams,
      );
      console.log('responseData');
      console.log(responseData);
      if (responseData && responseData.reportlist) {
        setReportData(responseData.reportlist);
      } else {
        Alert.alert('Error', 'Failed to fetch report data from the server');
      }
    } else {
      alert(
        'Please select both a subject and a class to generate the test report.',
      );
    }
  };

  const toggleView = viewType => {
    setActiveView(viewType);
  };
  const handleExcelButtonPress = async () => {
    if (reportData.length > 0) {
      console.log('updatedReportData');
      // console.log(reportData);
      // Sort reportData by rank in ascending order
      reportData.sort((a, b) => a.rank - b.rank);

      const updatedReportData = reportData.map(item => {
        // Create a new object to store the merged properties
        const updatedItem = {
          rollNo: item.rollNo,
          studentName: item.studentName,
          rank: item.rank,
        };

        // Merge subjectData properties into updatedItem
        item.subjectData.forEach(subject => {
          updatedItem[subject.subName] =
            subject.getMarks + '/' + subject.totalMarks;
        });

        // Add remaining properties
        updatedItem.sumGetMarks = item.sumGetMarks;
        updatedItem.sumTotalMarks = item.sumTotalMarks;
        updatedItem.percentage = item.percentage;

        return updatedItem;
      });

      console.log(updatedReportData);
      // Assuming you have schoolName and classDivision variables defined
      const filename = 'Test Report'; // Define your filename here
      const filePath1 = await generateExcelFile(
        filename,
        updatedReportData,
        '',
        '',
      );
      // Optionally, you can add logic to open or view the downloaded file here
    } else {
      Alert.alert('Error', 'No data available to export to Excel');
    }
  };

  return (
    <View style={styles.container}>
      <CustomPicker
        selectedValue={selectedTest}
        onValueChange={(itemValue, itemIndex) => setSelectedTest(itemValue)}
        items={tests}
        labelKey="text"
        valueKey="id"
        placeholder="Select Test"
      />
      <CustomPicker
        selectedValue={selectedClass}
        onValueChange={(itemValue, itemIndex) => setSelectedClass(itemValue)}
        items={classes}
        labelKey="classdivName"
        valueKey="classdivId"
        placeholder="Select Class"
      />

      <TouchableOpacity
        style={[
          styles.generateButton,
          {
            elevation: selectedClass && selectedTest ? 3 : 0,
            backgroundColor:
              selectedClass && selectedTest ? '#3498db' : '#ecf4ff',
          },
        ]}
        onPress={handleGenerateReport}
        disabled={!selectedClass && !selectedTest}>
        <Text
          style={[
            styles.buttonText,
            {color: selectedClass && selectedTest ? '#fff' : '#000'},
          ]}>
          Generate Report
        </Text>
      </TouchableOpacity>

      <View style={styles.toggleContainer}>
        {reportData.length > 0 && (
          <>
            {/* Excel Export Button */}
            <TouchableOpacity
              onPress={handleExcelButtonPress}
              style={[styles.button, styles.excelButton]}>
              <Text style={styles.exceltext}>Excel</Text>
              <MaterialCommunityIcons
                name="file-excel"
                size={24}
                color="#fff"
                style={styles.icon}
              />
            </TouchableOpacity>

            {/* List View Button */}
            <TouchableOpacity
              onPress={() => toggleView('list')}
              style={[
                styles.toggleButton,
                activeView === 'list' && styles.activeToggleButton,
              ]}>
              <Ionicons
                name="list-outline"
                size={24}
                color={activeView === 'list' ? '#fff' : '#fff'}
              />
            </TouchableOpacity>

            {/* Grid View Button */}
            <TouchableOpacity
              onPress={() => toggleView('grid')}
              style={[
                styles.toggleButton,
                activeView === 'grid' && styles.activeToggleButton,
              ]}>
              <Ionicons
                name="grid-outline"
                size={24}
                color={activeView === 'grid' ? '#fff' : '#fff'}
              />
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* Render either list view or grid view based on view type */}
      {activeView === 'list' ? (
        <FlatList
          data={reportData}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => (
            <View style={styles.studentContainer}>
              <Text style={styles.rollNo}>{item.rollNo}</Text>
              <Text style={styles.studentName}>{item.studentName}</Text>
              <Text style={styles.percentage}>{item.percentage}%</Text>
            </View>
          )}
          ListHeaderComponent={() =>
            reportData && reportData.length > 0 ? (
              <View style={styles.headerContainer}>
                <Text style={styles.headerText}>Roll No</Text>
                <Text style={styles.headerText}>Student Name</Text>
                <Text style={styles.headerText}>Percentage</Text>
              </View>
            ) : null
          }
        />
      ) : (
        <Text>Grid View</Text>
      )}
    </View>
  );
};

const CustomPicker = ({
  selectedValue,
  onValueChange,
  items,
  labelKey,
  valueKey,
  placeholder,
}) => {
  return (
    <View style={styles.pickerContainer}>
      <Picker
        selectedValue={selectedValue}
        onValueChange={onValueChange}
        style={styles.picker}
        dropdownIconColor="#000">
        <Picker.Item label={placeholder} value="" />
        {items.map((item, index) => (
          <Picker.Item
            label={item[labelKey]}
            value={item[valueKey]}
            key={index}
          />
        ))}
      </Picker>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  pickerContainer: {
    width: '100%',
    backgroundColor: '#f2f2f2',
    marginBottom: 16,
    borderRadius: 15,
  },
  picker: {
    height: 50,
    width: '100%',
    color: '#000',
  },
  generateButton: {
    backgroundColor: '#3498db',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginBottom: 20,
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  studentContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    // alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  rollNo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  studentName: {
    fontSize: 16,
    color: '#000',
  },
  percentage: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    marginTop: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: '#f2f2f2',
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  toggleContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 10,
  },
  toggleButton: {
    padding: 10,
    backgroundColor: 'grey',
    // borderRadius: 5,
    // marginHorizontal: 5,
  },
  activeToggleButton: {
    backgroundColor: 'red',
  },
  excelButton: {
    backgroundColor: '#3498db',
    flexDirection: 'row', // Arrange children horizontally
    alignItems: 'center', // Center children vertically
    elevation: 3,
    paddingHorizontal: 10,
    paddingVertical: 10,
    // width: '30%',
  },

  button: {
    backgroundColor: '#3498db',
    elevation: 3,
    color: '#fff',
    // width: '30%',
  },

  exceltext: {
    color: '#fff',
    marginLeft: 'auto', // Push the text to the left as much as possible
  },

  icon: {
    marginLeft: 'auto', // Push the icon to the right as much as possible
  },
});

export default TestReportScreen;
