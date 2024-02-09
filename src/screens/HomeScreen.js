import React, {useState, useLayoutEffect, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, FlatList} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import BottomMenu from '../menu/BottomMenu';
import {useRoute} from '@react-navigation/native';
import {getData} from '../services/commonService';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = ({navigation}) => {
  const [lecturesData, setLecturesData] = useState([]);
  const route = useRoute();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: null,
    });
  }, [navigation]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const teacherId = await AsyncStorage.getItem('teacherId');
        const queryParams = {teacherId};
        const response = await getData('getteachertimetable', queryParams);
        console.log(response);

        setLecturesData(response.teachertimetabledata);
      } catch (error) {
        console.error('Error fetching teacher timetable data:', error);
      }
    };

    fetchData();
  }, []);

  const handleNavigateToSection = section => {
    navigation.navigate(section);
    console.log(`Navigating to ${section}`);
  };

  const menuItems = [
    {
      id: '1',
      section: 'Profile',
      text: 'Profile',
      icon: 'person-outline',
      iconColor: '#194989',
      backgroundColor: '#ecf4ff', // Light Blue
    },
    {
      id: '2',
      section: 'Attendancelist',
      text: 'Attendance',
      icon: 'calendar-outline',
      iconColor: '#63316e',
      backgroundColor: '#faebf0', //#4f9a93
    },
    {
      id: '3',
      section: 'Testmarkslist',
      text: 'Testmarks',
      icon: 'list-outline',
      iconColor: '#4f9a93',
      backgroundColor: '#e6f4f4',
    },
    {
      id: '4',
      section: 'Timetable',
      text: 'Timetable',
      icon: 'alarm-outline',
      iconColor: '#222c50',
      backgroundColor: '#e4e8f4',
    },
    {
      id: '5',
      section: 'Homework',
      text: 'Home Work',
      icon: 'book-outline',
      iconColor: '#7f803c',
      backgroundColor: '#f6f4dd',
    },
    {
      id: '6',
      section: 'StudentList',
      text: 'Student Info',
      icon: 'person-circle-outline',
      iconColor: '#944a63',
      backgroundColor: '#f7ecf0',
    },
    {
      id: '7',
      section: 'Testmarkslist',
      text: 'Message',
      icon: 'chatbox-outline',
      iconColor: '#9c5786',
      backgroundColor: '#f8edf5',
    },
    {
      id: '8',
      section: 'NewsEvent',
      text: 'News & Event',
      icon: 'megaphone-outline',
      iconColor: '#152848',
      backgroundColor: '#ddf4e2',
    },
    {
      id: '9',
      section: 'Logout',
      text: 'Logout',
      icon: 'log-out',
      iconColor: '#152848',
      backgroundColor: '#ddf4e2',
    },
  ];

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

  const renderItem = ({item}) => (
    <TouchableOpacity
      style={styles.menuItem}
      onPress={() => handleNavigateToSection(item.section)}>
      <View
        style={[styles.iconContainer, {backgroundColor: item.backgroundColor}]}>
        <Ionicons name={item.icon} size={25} color={item.iconColor} />
      </View>
      <Text style={styles.menuItemText}>{item.text}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Menu Items */}
      <FlatList
        data={menuItems}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        numColumns={4}
        columnWrapperStyle={styles.buttonContainer}
      />

      {/* Today's Lectures */}
      <View style={styles.todayLecturesContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.todayLecturesTitle}>Today's Lectures</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('TodayLectures')}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={lecturesData}
          keyExtractor={item => item.id}
          renderItem={renderLectureItem}
          horizontal
          pagingEnabled
        />
      </View>

      <BottomMenu navigation={navigation} route={route} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    borderColor: 'grey',
    borderRadius: 10,
    // padding: 16,
  },
  buttonContainer: {
    justifyContent: 'space-between',
    margin: 8,
  },
  menuItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    backgroundColor: '#fff', // Light color for the square box
    borderRadius: 10,
    padding: 18,
    marginBottom: 5,
  },
  menuItemText: {
    color: '#333',
    fontSize: 10,
    textAlign: 'center',
  },
  lectureContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ecf0f1',
    padding: 16,
    borderRadius: 10,
    margin: 10,
    elevation: 3,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8, // Adjust this value as needed
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
    marginRight: 16,
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
  todayLecturesContainer: {
    // backgroundColor: '#ecf0f1',
    borderRadius: 10,
    margin: 8,
  },
  todayLecturesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  viewAllText: {
    color: '#000',
    fontSize: 12,
  },
});

export default HomeScreen;
