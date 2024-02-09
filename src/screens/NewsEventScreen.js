// Import necessary components and libraries
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

  // Function to fetch news events on page load
  useEffect(() => {
    const fetchNewsEvents = async () => {
      try {
        // const teacherId = await AsyncStorage.getItem('teacherId');
        // const queryParams = {teacherId};
        const response = await getData('news', {});
        console.log(response);
        if (response && response.success) {
          setNewsEvents(response.news);
        }
      } catch (error) {
        console.error('Error fetching news events:', error);
      }
    };

    // Call the function to fetch news events
    fetchNewsEvents();
  }, []);

  const handleNavigateToSection = section => {
    navigation.navigate(section);
    console.log(`Navigating to ${section}`);
  };

  return (
    <Provider theme={theme}>
      <View style={styles.container}>
        {/* News Events List */}
        <FlatList
          data={newsEvents}
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
