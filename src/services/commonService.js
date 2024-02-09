import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';

import config from '../../config';

const getAuthorizationHeader = async () => {
  const authToken = await AsyncStorage.getItem('authToken');
  return authToken || '';
};

export const getData = async (endpoint, queryParams = {}) => {
  try {
    const authorizationHeader = await getAuthorizationHeader();

    const queryString = Object.keys(queryParams)
      .map(key => `${key}=${queryParams[key]}`)
      .join('&');

    const response = await fetch(
      `${config.API_URL}${endpoint}?${queryString}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: authorizationHeader,
        },
      },
    );

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error during GET request:', error.message);
  }
};

export const postData = async (endpoint, requestData) => {
  try {
    const authorizationHeader = await getAuthorizationHeader();

    const response = await fetch(`${config.API_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authorizationHeader,
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    console.log('POST Data:', data);
    return data;
  } catch (error) {
    console.error('Error during POST request:', error.message);
  }
};

export const deleteData = async endpoint => {
  try {
    const authToken = await AsyncStorage.getItem('authToken');

    const response = await fetch(`${config.API_URL}${endpoint}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authToken || '',
      },
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    console.log('DELETE Data:', data);
    return data;
  } catch (error) {
    console.error('Error during DELETE request:', error.message);
  }
};

export const putData = async (endpoint, requestData) => {
  try {
    const authToken = await AsyncStorage.getItem('authToken');

    const response = await fetch(`${config.API_URL}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authToken || '',
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    console.log('PUT Data:', data);
    return data;
  } catch (error) {
    console.error('Error during PUT request:', error.message);
  }
};

export const generateExcelFile = async (filename, data) => {
  try {
    const headers = Object.keys(data[0]);
    const csvData = [
      headers.join(','),
      ...data.map(item => headers.map(key => item[key]).join(',')),
    ].join('\n');

    const filePath = `${RNFS.DocumentDirectoryPath}/${filename}.csv`;

    await RNFS.writeFile(filePath, csvData, 'utf8');

    const fileInfo = await RNFS.stat(filePath);

    console.log(fileInfo);

    const downloadResult = fileInfo;

    if (downloadResult && downloadResult.isFile()) {
      await Share.open({
        url: `file://${downloadResult.path}`,
        mimeType: 'text/csv',
        title: 'Open CSV File',
      });
    } else {
      console.error('Error: Share.open returned null or undefined');
    }

    return filePath;
  } catch (error) {
    console.error('Error generating Excel file:', error);
    throw error;
  }
};
