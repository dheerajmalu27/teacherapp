import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, FlatList} from 'react-native';
import {Provider, Snackbar} from 'react-native-paper';
import {getData} from '../services/commonService';
import {useNavigation, useRoute} from '@react-navigation/native';
import BottomMenu from '../menu/BottomMenu';

// Main component
const NewsEventScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [newsEvents, setNewsEvents] = useState([]);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [selectedTab, setSelectedTab] = useState('News'); // Default to 'News'

  // Function to fetch news events on page load
  useEffect(() => {
    const fetchNewsEvents = async () => {
      try {
        // const teacherId = await AsyncStorage.getItem('teacherId');
        // const queryParams = {teacherId};
        const response = await getData('news', {});
        console.log(response);
        if (response && response.success) {
          response.news.sort((a, b) => {
            const dateA = new Date(a.newsEventDate);
            const dateB = new Date(b.newsEventDate);
            return dateB - dateA;
          });
          setNewsEvents(response.news);
        }
      } catch (error) {
        console.error('Error fetching news events:', error);
      }
    };

    // Call the function to fetch news events
    fetchNewsEvents();
  }, []);

  // Function to filter news events based on selected tab
  const filteredNewsEvents = newsEvents.filter(item => {
    return selectedTab === 'News'
      ? item.newsEventType === 2
      : item.newsEventType === 1;
  });

  const handleNavigateToSection = section => {
    navigation.navigate(section);
    console.log(`Navigating to ${section}`);
  };

  return (
    <Provider theme={theme}>
      <View style={styles.container}>
        {/* Toggle buttons to switch between news and events */}
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              selectedTab === 'News' && styles.activeToggle,
            ]}
            onPress={() => setSelectedTab('News')}>
            <Text style={styles.toggleButtonText}>News</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              selectedTab === 'Events' && styles.activeToggle1,
            ]}
            onPress={() => setSelectedTab('Events')}>
            <Text style={styles.toggleButtonText1}>Events</Text>
          </TouchableOpacity>
        </View>

        {/* News Events List */}
        <FlatList
          data={filteredNewsEvents}
          keyExtractor={item => item.id.toString()}
          renderItem={({item}) => (
            <TouchableOpacity
              style={[
                styles.newsEventItem,
                item.newsEventType === 1
                  ? styles.newsEventItemPrimary
                  : styles.newsEventItemSecondary,
              ]}
              onPress={() => {
                // Handle click on a news event if needed
              }}>
              <View style={styles.newsEventHeader}>
                <Text
                  style={[
                    styles.text,
                    item.newsEventType === 1
                      ? styles.textPrimary
                      : styles.textSecondary,
                  ]}>
                  {item.newsEventTitle}
                </Text>
              </View>
              <Text
                style={[
                  styles.description,
                  item.newsEventType === 1
                    ? styles.descriptionPrimary
                    : styles.descriptionSecondary,
                ]}>
                {item.newsEventDetail}
              </Text>
              <Text
                style={[
                  styles.date,
                  item.newsEventType === 1
                    ? styles.datePrimary
                    : styles.dateSecondary,
                ]}>
                {item.newsEventDate}
              </Text>
            </TouchableOpacity>
          )}
        />

        {/* Snackbar for showing messages */}
        <Snackbar
          visible={snackbarVisible}
          onDismiss={() => setSnackbarVisible(false)}
          duration={3000}>
          {snackbarMessage}
        </Snackbar>

        <BottomMenu navigation={navigation} route={route} />
      </View>
    </Provider>
  );
};

const theme = {
  // Your theme configuration
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: 20,
    backgroundColor: '#fff',
    color: '#000',
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  toggleButton: {
    width: '48%',
    paddingVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-around',
    textAlign: 'center',
    // paddingHorizontal: 20,
    borderRadius: 5,
  },
  activeToggle: {
    // width: 'auto',
    backgroundColor: '#faebf0', // Color for active toggle button
    color: '#63316e',
  },
  activeToggle1: {
    // width: 'auto',
    backgroundColor: '#ecf4ff', // Color for active toggle button
    color: '#194989',
  },
  toggleButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#63316e',
  },
  toggleButtonText1: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#194989',
  },
  newsEventItem: {
    marginBottom: 20,
    padding: 10,
    marginLeft: 15,
    marginRight: 15,
    borderRadius: 5,
    elevation: 3,
  },
  newsEventItemPrimary: {
    backgroundColor: '#ecf4ff', // Primary color
  },
  newsEventItemSecondary: {
    backgroundColor: '#faebf0', // Secondary color
  },
  newsEventHeader: {
    marginBottom: 5,
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  textPrimary: {
    color: '#194989', // Primary text color
  },
  textSecondary: {
    color: '#63316e', // Secondary text color
  },
  date: {
    textAlign: 'right',
    color: '#777',
  },
  datePrimary: {
    color: '#194989', // Primary text color
  },
  dateSecondary: {
    color: '#63316e', // Secondary text color
  },
  description: {
    color: '#fff',
  },
  descriptionPrimary: {
    color: '#194989', // Primary text color
  },
  descriptionSecondary: {
    color: '#63316e', // Secondary text color
  },
});

export default NewsEventScreen;
