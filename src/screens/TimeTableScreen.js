import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Text, FlatList, TouchableOpacity} from 'react-native';
import {LocaleConfig} from 'react-native-calendars';

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

const TimeTableScreen = () => {
  const [items, setItems] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);

  useEffect(() => {
    // Fetch and set your data here, e.g., from an API
    // For simplicity, I'll use the provided dummy data
    const dummyData = [
      {
        id: 1,
        day: 'Friday',
        name: 'Event 1',
        from: '10:00 AM',
        to: '12:00 PM',
      },
      {
        id: 2,
        day: 'Wednesday',
        name: 'Event 2',
        from: '02:00 PM',
        to: '04:00 PM',
      },
      {
        id: 3,
        day: 'Monday',
        name: 'Event 1',
        from: '10:00 AM',
        to: '12:00 PM',
      },
      {
        id: 4,
        day: 'Tuesday',
        name: 'Event 2',
        from: '02:00 PM',
        to: '04:00 PM',
      },
      // Add more data as needed
    ];

    const groupedData = {};
    dummyData.forEach(item => {
      if (!groupedData[item.day]) {
        groupedData[item.day] = [];
      }
      groupedData[item.day].push(item);
    });

    setItems(Object.entries(groupedData));
  }, []);

  const renderDayItem = ({item}) => (
    <View style={styles.eventContainer}>
      <View style={styles.tableContainer}>
        <View style={styles.tableRow}>
          <Text style={styles.tableLabel}>Event Name</Text>
          <Text style={styles.tableValue}>{item.name}</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableLabel}>From</Text>
          <Text style={styles.tableValue}>{item.from}</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableLabel}>To</Text>
          <Text style={styles.tableValue}>{item.to}</Text>
        </View>
      </View>
    </View>
  );

  const handleDayPress = day => {
    // Update the selected day
    setSelectedDay(day);
  };

  const filteredItems = selectedDay
    ? items.filter(item => item[0] === selectedDay)
    : items;

  return (
    <View style={styles.container}>
      {/* <Text style={styles.title}>Weekly Schedule</Text> */}
      <FlatList
        style={styles.FlatList}
        data={Object.keys(LocaleConfig.locales['en'].dayNames)}
        keyExtractor={(day, index) => index.toString()}
        renderItem={({item}) => (
          <TouchableOpacity
            onPress={() =>
              handleDayPress(LocaleConfig.locales['en'].dayNames[item])
            }>
            <View
              style={[
                styles.dayContainer,
                selectedDay === LocaleConfig.locales['en'].dayNames[item] &&
                  styles.selectedDayContainer,
              ]}>
              <Text
                style={[
                  styles.dayText,
                  selectedDay === LocaleConfig.locales['en'].dayNames[item] &&
                    styles.selectedDayText,
                ]}>
                {LocaleConfig.locales['en'].dayNames[item]}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        horizontal
      />
      {selectedDay && (
        <Text style={styles.date}>{`Events for ${selectedDay}`}</Text>
      )}
      <FlatList
        data={filteredItems}
        keyExtractor={item => item[0]}
        renderItem={({item}) => (
          <View>
            <Text style={styles.date}>{item[0]}</Text>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2c3e50',
  },
  FlatList: {
    margin: 10,
  },
  dayContainer: {
    // flex: 4,
    // marginBottom: 10,
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
