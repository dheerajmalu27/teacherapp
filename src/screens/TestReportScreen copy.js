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
import {getData} from '../services/commonService';

const TestReportScreen = () => {
  const navigation = useNavigation();
  const [selectedTest, setSelectedTest] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [tests, setTests] = useState([]);
  const [classes, setClasses] = useState([]);
  const [reportData, setReportData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
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
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: '#f2f2f2',
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
});

export default TestReportScreen;
