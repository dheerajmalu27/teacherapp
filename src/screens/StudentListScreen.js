import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import BottomMenu from '../menu/BottomMenu';
import {useRoute} from '@react-navigation/native';
import {getData} from '../services/commonService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../../config';
const StudentListScreen = ({navigation}) => {
  const route = useRoute();
  const [data, setData] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [studentList, setStudentList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const teacherId = await AsyncStorage.getItem('teacherId');

      try {
        const queryParams = {teacherId};
        const response = await getData('teacherclassdivlist', queryParams);
        console.log(response.classdivlist);
        setData(response.classdivlist);
      } catch (error) {
        console.error('Error fetching test marks data:', error);
      }
    };

    fetchData();
  }, []);

  const handleClassChange = classValue => {
    setSelectedClass(classValue);
  };

  const handleSubmit = async () => {
    const [classId, divId] = selectedClass.split('-');

    try {
      const queryParams = {classId, divId};
      const response = await getData(
        'getallclassdivisionstudentlist',
        queryParams,
      );
      console.log(response); // Handle the response as needed
      setStudentList(response.students || []);
    } catch (error) {
      console.error('Error fetching student list:', error);
    }
  };

  const renderStudentItem = ({item}) => (
    <TouchableOpacity
      style={styles.studentItem}
      onPress={() => navigation.navigate('StudentInfo', {studentId: item.id})}>
      <Image
        source={{uri: config.IMAGE_URL + item.profileImage}}
        style={styles.studentImage}
      />
      <Text style={styles.studentName}>{item.fullName}</Text>
      <TouchableOpacity style={styles.iconContainer}>
        <Ionicons name="chevron-forward-outline" size={18} color="#000" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Picker
          selectedValue={selectedClass}
          onValueChange={handleClassChange}
          style={styles.picker}
          dropdownIconColor="black">
          <Picker.Item label="Select Class" value="" />
          {data.map(({classId, divId, className, divName}) => (
            <Picker.Item
              key={`${classId}-${divId}`}
              label={`${className}-${divName}`}
              value={`${classId}-${divId}`}
            />
          ))}
        </Picker>
        <TouchableOpacity
          style={[
            styles.submitButton,
            {
              elevation: selectedClass ? 3 : 0,
              backgroundColor: selectedClass ? '#3498db' : '#ecf4ff',
            },
          ]}
          onPress={handleSubmit}
          disabled={!selectedClass}>
          <Text
            style={[
              styles.submitButtonText,
              {color: selectedClass ? '#fff' : '#000'},
            ]}>
            Submit
          </Text>
        </TouchableOpacity>

        <FlatList
          data={studentList}
          renderItem={renderStudentItem}
          keyExtractor={item => item.id}
          style={styles.studentList}
        />
      </View>
      <BottomMenu navigation={navigation} route={route} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
    backgroundColor: '#fff',
  },
  contentContainer: {
    flex: 1,
    paddingLeft: 10,
    paddingRight: 10,
  },
  picker: {
    height: 50,
    width: '100%',
    backgroundColor: '#f2f2f2',
    marginBottom: 16,
    borderRadius: 15,
    color: '#000',
  },
  submitButton: {
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 16,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  studentList: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    borderRadius: 5,
    padding: 10,
    marginBottom: 16,
  },
  studentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
  },
  studentImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  studentName: {
    flex: 1,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  iconContainer: {
    marginLeft: 10,
  },
  disabledButton: {
    backgroundColor: '#ecf0f1', // Light background color for disabled button
  },
  enabledButton: {
    backgroundColor: '#3498db', // Dark background color for enabled button
  },
});

export default StudentListScreen;
