import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  FlatList,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Picker} from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getData} from '../services/commonService';

const SubjectReportScreen = () => {
  const navigation = useNavigation();
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedTest, setSelectedTest] = useState('');
  const [subjectList, setSubjectList] = useState([]);
  const [testList, setTestList] = useState([]);
  const [testMarksData, setTestMarksData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const teacherId = await AsyncStorage.getItem('teacherId');

        // Fetch subject list
        const responseSubject = await getData('teachersubjectclasslist', {
          teacherId,
        });
        if (
          responseSubject &&
          responseSubject.classdivlist &&
          responseSubject.classdivlist.length > 0
        ) {
          const subjects = responseSubject.classdivlist.map(item => ({
            key: `${item.subId}-${item.classId}-${item.divId}`,
            value: `${item.subName}-${item.className}-${item.divName}`,
          }));
          setSubjectList(subjects);
        } else {
          Alert.alert('Error', 'Failed to fetch subjects from the server');
        }

        // Fetch test list
        const responseTest = await getData('testlist');
        if (responseTest && responseTest.test) {
          setTestList(
            responseTest.test.map(item => ({
              key: item.id,
              value: item.text,
            })),
          );
        } else {
          Alert.alert('Error', 'Failed to fetch tests from the server');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        Alert.alert('Error', 'An error occurred while fetching data');
      }
    };
    fetchData();
  }, []);

  const handleGenerateReport = async () => {
    if (selectedSubject && selectedTest) {
      const classIdDivIdArray = selectedSubject.split('-');
      const subId = classIdDivIdArray[0];
      const classId = classIdDivIdArray[1];
      const divId = classIdDivIdArray[2];
      const queryParams = {
        classId,
        divId,
        subId,
        testId: selectedTest,
      };
      const responseData = await getData('getbyrecordtestmarks', queryParams);
      console.log(responseData);
      if (
        responseData.testmarksstudentlist &&
        responseData.testmarksstudentlist.length > 0
      ) {
        const data = responseData.testmarksstudentlist.map(item => ({
          rollNo: item.TestmarksStudent.rollNo,
          studentName: `${item.TestmarksStudent.firstName} ${item.TestmarksStudent.lastName}`,
          getMarks: item.getMarks,
          totalMarks: item.totalMarks,
        }));

        // Sort the data array by getMarks in descending order
        data.sort((a, b) => b.getMarks - a.getMarks);

        setTestMarksData(data);
      } else {
        // Show record not found alert
        Alert.alert(
          'Record Not Found',
          'No records found for this subject test.',
        );
      }
    } else {
      Alert.alert('Record Not Found', 'No subjects found for this teacher.');
    }
  };

  return (
    <View style={styles.container}>
      <CustomPicker
        selectedValue={selectedSubject}
        onValueChange={itemValue => setSelectedSubject(itemValue)}
        items={subjectList}
        placeholder="Select Subject"
      />
      <CustomPicker
        selectedValue={selectedTest}
        onValueChange={itemValue => setSelectedTest(itemValue)}
        items={testList}
        placeholder="Select Test"
      />
      <TouchableOpacity
        style={[
          styles.generateButton,
          {
            elevation: selectedSubject && selectedTest ? 3 : 0,
            backgroundColor:
              selectedSubject && selectedTest ? '#3498db' : '#ecf4ff',
          },
        ]}
        onPress={handleGenerateReport}
        disabled={!selectedSubject || !selectedTest}>
        <Text
          style={[
            styles.buttonText,
            {color: selectedSubject && selectedTest ? '#fff' : '#000'},
          ]}>
          Generate Report
        </Text>
      </TouchableOpacity>

      <FlatList
        data={testMarksData}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => (
          <View style={styles.studentContainer}>
            <Text style={styles.rollNo}>{item.rollNo}</Text>
            <Text style={styles.studentName}>{item.studentName}</Text>
            <Text style={styles.percentage}>
              {item.getMarks}/{item.totalMarks}
            </Text>
          </View>
        )}
        ListHeaderComponent={() =>
          testMarksData && testMarksData.length > 0 ? (
            <View style={styles.headerContainer}>
              <Text style={styles.headerText}>Roll No</Text>
              <Text style={styles.headerText}>Student Name</Text>
              <Text style={styles.headerText}>Marks</Text>
            </View>
          ) : null
        }
      />
    </View>
  );
};

const CustomPicker = ({selectedValue, onValueChange, items, placeholder}) => {
  return (
    <View style={styles.pickerContainer}>
      <Picker
        selectedValue={selectedValue}
        onValueChange={onValueChange}
        style={styles.picker}
        dropdownIconColor="#000">
        <Picker.Item label={placeholder} value="" />
        {items.map((item, index) => (
          <Picker.Item label={item.value} value={item.key} key={index} />
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
    alignItems: 'flex-start',
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

export default SubjectReportScreen;
