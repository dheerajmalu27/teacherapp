import React from 'react';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
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
import SubjectReportScreen from '../screens/SubjectReportScreen';
import AttendanceReportScreen from '../screens/AttendanceReportScreen';
import TestReportScreen from '../screens/TestReportScreen';
const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen
        name="Homework"
        component={HomeworkScreen}
        options={{
          title: 'Home work', // Set the custom header name
          ...TransitionPresets.SlideFromRightIOS, // Apply slide from right transition
        }}
      />
      <Stack.Screen
        name="NewsEvent"
        component={NewsEventScreen}
        options={{
          title: 'News & Events', // Set the custom header name
          ...TransitionPresets.SlideFromRightIOS, // Apply slide from right transition
        }}
      />
      <Stack.Screen
        name="AttendanceList"
        component={AttendanceListScreen}
        options={{
          title: 'Attendance List', // Set the custom header name
          ...TransitionPresets.SlideFromRightIOS, // Apply slide from right transition
        }}
      />
      <Stack.Screen
        name="TodayLectures"
        component={TodayLecturesScreen}
        options={{
          title: 'Today Lectures', // Set the custom header name
          ...TransitionPresets.SlideFromRightIOS, // Apply slide from right transition
        }}
      />
      <Stack.Screen
        name="ExamResult"
        component={ExamResultScreen}
        options={{
          title: 'Exam Result', // Set the custom header name
          ...TransitionPresets.SlideFromRightIOS, // Apply slide from right transition
        }}
      />
      <Stack.Screen
        name="StudentList"
        component={StudentListScreen}
        options={{
          title: 'Student List', // Set the custom header name
          ...TransitionPresets.SlideFromRightIOS, // Apply slide from right transition
        }}
      />
      <Stack.Screen
        name="TestMarksList"
        component={TestMarksListScreen}
        options={{
          title: 'Test Marks List', // Set the custom header name
          ...TransitionPresets.SlideFromRightIOS, // Apply slide from right transition
        }}
      />

      <Stack.Screen
        name="Timetable"
        component={TimeTableScreen}
        options={{
          title: 'Time Table', // Set the custom header name
          ...TransitionPresets.SlideFromRightIOS, // Apply slide from right transition
        }}
      />
      <Stack.Screen
        name="AddAttendance"
        component={AddAttendanceScreen}
        options={({route}) => ({
          title:
            route.params && route.params.editdate
              ? 'Edit Attendance'
              : 'Add Attendance',
          ...TransitionPresets.SlideFromRightIOS,
        })}
      />
      <Stack.Screen
        name="StudentInfo"
        component={StudentInfoScreen}
        options={{
          title: 'Student Info', // Set the custom header name
          ...TransitionPresets.SlideFromRightIOS, // Apply slide from right transition
        }}
      />
      <Stack.Screen
        name="AddTestMarks"
        component={AddTestMarksScreen}
        options={{
          title: 'Test Marks', // Set the custom header name
          ...TransitionPresets.SlideFromRightIOS, // Apply slide from right transition
        }}
      />

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
      <Stack.Screen
        name="SubjectReport"
        component={SubjectReportScreen}
        options={{
          title: 'Subject Report', // Set the custom header name
          ...TransitionPresets.SlideFromRightIOS, // Apply slide from right transition
        }}
      />
      <Stack.Screen
        name="AttendanceReport"
        component={AttendanceReportScreen}
        options={{
          title: 'Attendance Report', // Set the custom header name
          ...TransitionPresets.SlideFromRightIOS, // Apply slide from right transition
        }}
      />
      <Stack.Screen
        name="TestReport"
        component={TestReportScreen}
        options={{
          title: 'Test Report', // Set the custom header name
          ...TransitionPresets.SlideFromRightIOS, // Apply slide from right transition
        }}
      />

      {/* Add more screens as needed */}
    </Stack.Navigator>
  );
};

export default AppNavigator;
