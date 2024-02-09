import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import ProgressBar from 'react-native-progress/Bar';
import {getData} from '../services/commonService';

const ExamResultScreen = ({route}) => {
  const [overallResult, setOverallResult] = useState({
    getMarks: 0,
    totalMarks: 0,
  });
  const [subjectResults, setSubjectResults] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const {studentId, testId} = route.params;

        // Replace 'your_api_endpoint_here' with the actual API endpoint
        const queryParams = {studentId, testId};
        const response = await getData('getstudenttestmarks', queryParams);

        // Calculate the sum of getMarks and totalMarks
        const totalGetMarks = response.reduce(
          (sum, item) => sum + parseInt(item.getMarks),
          0,
        );
        const totalTotalMarks = response.reduce(
          (sum, item) => sum + parseInt(item.totalMarks),
          0,
        );

        setOverallResult({
          getMarks: totalGetMarks,
          totalMarks: totalTotalMarks,
        });
        setSubjectResults(response);
      } catch (error) {
        console.error('Error fetching data:', error);
        // Handle error
      }
    };

    fetchData();
  }, [route.params]);

  const calculatePercentage = () => {
    if (overallResult.totalMarks === 0) return 0;
    return (overallResult.getMarks / overallResult.totalMarks) * 100;
  };

  const renderSubjectItem = subject => (
    <View style={styles.subjectItem} key={subject.name}>
      <View style={styles.subjectInfoContainer}>
        <Text style={styles.subjectName}>{subject.subName}</Text>
        <Text style={styles.subjectMarks}>
          {subject.getMarks}/{subject.totalMarks}
        </Text>
      </View>
      <ProgressBar
        progress={subject.getMarks / subject.totalMarks}
        width={null}
        height={10}
        color="#3498db"
        style={{marginTop: 5}}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.overallResultContainer}>
        <Text style={styles.overallResultText}>
          Overall Result: {overallResult.getMarks}/{overallResult.totalMarks}
        </Text>
      </View>
      <ScrollView
        style={styles.subjectsContainer}
        showsVerticalScrollIndicator={true}>
        <Text style={styles.subjectsHeading}>Subject-wise Result</Text>
        {subjectResults.map(renderSubjectItem)}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  overallResultContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  overallResultText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
  },
  subjectsContainer: {
    flex: 1,
    marginBottom: 10,
  },
  subjectsHeading: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
  },
  subjectItem: {
    backgroundColor: '#f8f8f8',
    marginBottom: 20,
    padding: 15,
  },
  subjectName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#000',
  },
  subjectMarks: {
    fontSize: 14,
    color: '#2c3e50',
  },
  subjectInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
});

export default ExamResultScreen;
