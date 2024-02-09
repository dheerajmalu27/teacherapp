// src/navigation/AppNavigator.js
import {Text} from 'react-native';
// src/navigation/AppNavigator.js
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import UserProfileScreen from '../screens/UserProfileScreen';
import LogoutScreen from '../screens/LogoutScreen'; // Import LogoutScreen
import LoginScreen from '../screens/Auth/LoginScreen';
import AttendanceListScreen from '../screens/AttendanceListScreen';
import TestMarksListScreen from '../screens/TestMarksListScreen';
import TimeTableScreen from '../screens/TimeTableScreen';
import AddAttendanceScreen from '../screens/AddAttendanceScreen';
import AddTestMarksScreen from '../screens/AddTestMarksScreen';
import StudentInfoScreen from '../screens/StudentInfoScreen';
import TodayLecturesScreen from '../screens/TodayLecturesScreen';
import ExamResultScreen from '../screens/ExamResultScreen';
import StudentListScreen from '../screens/StudentListScreen';
import HomeworkScreen from '../screens/HomeworkScreen';
import NewsEventScreen from '../screens/NewsEventScreen';
const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Homework" component={HomeworkScreen} />
      <Stack.Screen name="NewsEvent" component={NewsEventScreen} />
      <Stack.Screen
        name="Attendancelist"
        component={AttendanceListScreen}
        options={{
          title: 'Attendance List', // Set the custom header name
        }}
      />
      <Stack.Screen
        name="TodayLectures"
        component={TodayLecturesScreen}
        options={{
          title: 'Today Lectures', // Set the custom header name
        }}
      />
      <Stack.Screen
        name="ExamResult"
        component={ExamResultScreen}
        options={{
          title: 'Exam Result', // Set the custom header name
        }}
      />
      <Stack.Screen
        name="StudentList"
        component={StudentListScreen}
        options={{
          title: 'Student List', // Set the custom header name
        }}
      />
      <Stack.Screen
        name="Testmarkslist"
        component={TestMarksListScreen}
        options={{
          title: 'Test Marks List', // Set the custom header name
        }}
      />

      <Stack.Screen name="Timetable" component={TimeTableScreen} />
      <Stack.Screen name="AddAttendance" component={AddAttendanceScreen} />
      <Stack.Screen name="StudentInfo" component={StudentInfoScreen} />
      <Stack.Screen
        name="AddTestMarks"
        component={AddTestMarksScreen}
        options={{
          title: 'Test Marks', // Set the custom header name
        }}
      />

      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen
        name="Profile"
        component={UserProfileScreen}
        options={UserProfileScreen.navigationOptions}
      />
      <Stack.Screen
        name="Logout"
        component={LogoutScreen}
        options={{
          title: 'Logout',
          headerStyle: {
            backgroundColor: '#f4511e',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      {/* Add more screens as needed */}
    </Stack.Navigator>
  );
};

export default AppNavigator;
