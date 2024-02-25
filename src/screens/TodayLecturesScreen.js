import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, FlatList} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {getData} from '../services/commonService';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TodayLecturesScreen = ({navigation}) => {
  const [lecturesData, setLecturesData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const teacherId = await AsyncStorage.getItem('teacherId');
        const queryParams = {teacherId};
        const response = await getData(
          'gettodaysteachertimetable',
          queryParams,
        );

        setLecturesData(response.teachertimetabledata);
      } catch (error) {
        console.error('Error fetching teacher timetable data:', error);
      }
    };

    fetchData();
  }, []);

  const renderLectureItem = ({item}) => (
    <View style={styles.lectureContainer}>
      <View style={styles.detailsContainer}>
        <Text style={styles.subject}>
          {item.title} {item.className}-{item.divName}
        </Text>
        <View style={styles.timeContainer}>
          <Ionicons
            name="time-outline"
            size={16}
            color="#3498db"
            style={styles.timeIcon}
          />
          <Text style={styles.timeText}>
            {item.start} - {item.end}
          </Text>
        </View>
      </View>
    </View>
  );

  // Conditionally set background color based on the length of lecturesData
  const screenBackgroundColor =
    lecturesData.length === 1 ? '#yourDesiredColor' : '#fff';

  return (
    <View style={[styles.container, {backgroundColor: screenBackgroundColor}]}>
      <FlatList
        data={lecturesData}
        keyExtractor={item => item.id.toString()}
        renderItem={renderLectureItem}
        contentContainerStyle={styles.flatListContainer}
      />
    </View>
  );
};

TodayLecturesScreen.navigationOptions = {
  title: "Today's Lectures",
  headerLeft: ({navigation}) => (
    <Ionicons
      name="arrow-back-outline"
      size={25}
      color="#fff"
      style={{marginLeft: 16}}
      onPress={() => navigation.goBack()}
    />
  ),
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flatListContainer: {
    padding: 16,
    backgroundColor: '#fff',
  },
  lectureContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ecf0f1',
    padding: 16,
    borderRadius: 10,
    marginBottom: 16,
    elevation: 3,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  timeIcon: {
    marginRight: 4,
  },
  timeText: {
    fontSize: 12,
    color: '#000',
  },
  detailsContainer: {
    flex: 1,
    marginLeft: 16,
  },
  subject: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  class: {
    fontSize: 14,
    color: '#555',
  },
});

export default TodayLecturesScreen;
