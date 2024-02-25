import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Text, FlatList, TouchableOpacity} from 'react-native';
import {LocaleConfig} from 'react-native-calendars';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getData, generateCsvFile, deleteData} from '../services/commonService';

LocaleConfig.locales['en'] = {
  monthNames: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ],
  monthNamesShort: [
    'Jan.',
    'Feb.',
    'Mar.',
    'Apr.',
    'May',
    'Jun.',
    'Jul.',
    'Aug.',
    'Sep.',
    'Oct.',
    'Nov.',
    'Dec.',
  ],
  dayNames: [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ],
  dayNamesShort: ['Sun.', 'Mon.', 'Tue.', 'Wed.', 'Thu.', 'Fri.', 'Sat.'],
};

LocaleConfig.defaultLocale = 'en';
const dayColors = [
  '#ecf4ff', // Sunday
  '#faebf0', // Monday
  '#e6f4f4', // Tuesday
  '#e4e8f4', // Wednesday
  '#f6f4dd', // Thursday
  '#f8edf5', // Friday
  '#ddf4e2', // Saturday
]; // Define an array of colors for each day

const TimeTableScreen = () => {
  const [items, setItems] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const teacherId = await AsyncStorage.getItem('teacherId');

      try {
        const queryParams = {teacherId};
        const response = await getData('getteachertimetable', queryParams);
        // console.log(response);

        if (
          response &&
          response.success &&
          Array.isArray(response.teachertimetabledata)
        ) {
          const groupedData = {};
          response.teachertimetabledata.forEach(item => {
            if (!groupedData[item.dayId]) {
              groupedData[item.dayId] = [];
            }
            groupedData[item.dayId].push(item);
          });
          console.log(groupedData);
          setItems(Object.entries(groupedData));
        } else {
          console.error('Error: Invalid response format');
        }
      } catch (error) {
        console.error('Error fetching test marks data:', error);
      }
    };

    fetchData();
  }, []);

  const renderDayItem = ({item}) => (
    <View style={styles.eventContainer}>
      <View
        style={[
          styles.tableContainer,
          {backgroundColor: dayColors[item.dayId]},
        ]}>
        <View style={styles.tableRow}>
          <Text style={styles.tableLabel}>Subject Class</Text>
          <Text style={styles.tableValue}>
            {`${item.title.trim()}-${item.className.trim()} ${item.divName.trim()}`}
          </Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableLabel}>Start Time</Text>
          <Text style={styles.tableValue}>{item.start}</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableLabel}>End Time</Text>
          <Text style={styles.tableValue}>{item.end}</Text>
        </View>
      </View>
    </View>
  );
  useEffect(() => {
    if (selectedDay) {
      console.log(selectedDay);
      console.log('items');
      console.log(items[0]);
      const filteredItems = items.filter(item => item[0] === selectedDay);
      console.log('Filtered Items:', filteredItems);
    }
  }, [selectedDay, items]);
  const handleDayPress = day => {
    console.log('day:' + day);
    setSelectedDay(day);
    console.log('items');
  };

  const filteredItems = selectedDay
    ? items.filter(item => item[0] === selectedDay)
    : items;

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredItems}
        keyExtractor={item => item[0]}
        renderItem={({item}) => (
          <View>
            <Text style={styles.date}>
              {LocaleConfig.locales['en'].dayNames[new Date(item[0]).getDay()]}
            </Text>
            <FlatList
              data={item[1]}
              keyExtractor={event => event.id.toString()}
              renderItem={renderDayItem}
            />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  FlatList: {
    margin: 10,
  },
  dayContainer: {
    height: 40,
    padding: 8,
    borderRadius: 5,
    backgroundColor: '#3498db',
    marginRight: 10,
  },
  selectedDayContainer: {
    backgroundColor: '#2980b9',
  },
  dayText: {
    color: 'white',
    fontWeight: 'bold',
  },
  selectedDayText: {
    color: '#ecf0f1',
  },
  eventContainer: {
    marginVertical: 8,
  },
  tableContainer: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 15,
    marginTop: 8,
    elevation: 3,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  tableLabel: {
    fontSize: 16,
    color: '#2c3e50',
    fontWeight: 'bold',
  },
  tableValue: {
    fontSize: 16,
    color: '#333',
  },
  date: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    color: '#2c3e50',
  },
});

export default TimeTableScreen;
