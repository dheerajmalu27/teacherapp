import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import XLSX from 'xlsx';
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

export const generateCsvFile = async (filename, data) => {
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
export const generateExcelFile = async (
  filename,
  ReportData,
  schoolName,
  classDivision,
) => {
  try {
    // Get the keys from the first element of ReportData
    const keys = Object.keys(ReportData[0]);
    console.log(keys);
    const schoolProfileName = await AsyncStorage.getItem('schoolProfileName');
    if (schoolProfileName) {
      schoolName = schoolProfileName;
    } else {
      const schoolData = await getData('schoolprofile');
      const schoolDetail =
        schoolData.schoolprofile[0].schoolName +
        '\n' +
        schoolData.schoolprofile[0].schoolAddress;
      const startDate = new Date(
        schoolData.schoolprofile[0].schoolStartDate.toISOString(),
      );
      const endDate = new Date(
        schoolData.schoolprofile[0].schoolEndDate.toISOString(),
      );
      await AsyncStorage.setItem('schoolProfileName', schoolDetail);
      await AsyncStorage.setItem('schoolStartDate', startDate);
      await AsyncStorage.setItem('schoolEndDate', endDate);
    }

    // Insert schoolName and classDivision at the beginning of the ReportData
    const headers = [
      [schoolName],
      [`ClassDivision: ${classDivision}`],
      keys.map(key => (key === 'percentage' ? key : key.split('-').join('/'))), // Adjust the keys
    ];
    ReportData.unshift(...headers);

    // Create a new workbook
    const workbook = XLSX.utils.book_new();

    // Create a new worksheet
    const worksheetData = ReportData.map(row => Object.values(row));
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

    // Set cell borders
    const range = XLSX.utils.decode_range(worksheet['!ref']);
    const borderStyle = {
      style: 'thin',
      color: {rgb: '000000'}, // Black color
    };
    for (let R = range.s.r; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cellAddress = {c: C, r: R};
        const cellRef = XLSX.utils.encode_cell(cellAddress);
        const cell = worksheet[cellRef];
        if (!cell) continue;
        cell.s = {
          ...cell.s,
          border: {
            top: borderStyle,
            bottom: borderStyle,
            left: borderStyle,
            right: borderStyle,
          },
        };
      }
    }

    // Merge cells for the first two rows
    worksheet['!merges'] = [
      {s: {r: 0, c: 0}, e: {r: 0, c: keys.length - 1}}, // Merge cells for the first row
      {s: {r: 1, c: 0}, e: {r: 1, c: keys.length - 1}}, // Merge cells for the second row
    ];

    // Set bold style for the first two rows
    worksheet['A1'].s = {
      bold: true,
      fontSize: 25,
      horizontal: 'center',
      vertical: 'center',
    };
    worksheet['A2'].s = {
      bold: true,
      fontSize: 25,
      horizontal: 'center',
      vertical: 'center',
    };

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Attendance Report');

    // Convert the workbook to a binary string
    const excelData = XLSX.write(workbook, {type: 'base64', bookType: 'xlsx'});

    // Create a directory for storing the file
    const directory = RNFS.DocumentDirectoryPath; // Use the document directory for saving files
    await RNFS.mkdir(directory);

    // Define the file path
    const filePath = `${directory}/${filename}.xlsx`;

    // Write the binary string to the file
    await RNFS.writeFile(filePath, excelData, 'base64');

    // Share the file with the user
    await Share.open({
      url: `file://${filePath}`,
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    return filePath;
  } catch (error) {
    console.error('Error generating Excel file:', error);
    throw error;
  }
};

// export const generateExcelFile = async (
//   filename,
//   ReportData,
//   schoolName,
//   classDivision,
// ) => {
//   try {
//     // Get the keys from the first element of ReportData
//     const keys = Object.keys(ReportData[0]);

//     // Insert schoolName and classDivision at the beginning of the ReportData
//     const headers = [
//       [schoolName],
//       [`ClassDivision: ${classDivision}`],
//       keys.map(key => (key === 'percentage' ? key : key.split('-').join('/'))), // Adjust the keys
//     ];
//     ReportData.unshift(...headers);

//     // Create a new workbook
//     const workbook = XLSX.utils.book_new();

//     // Create a new worksheet
//     const worksheetData = ReportData.map(row => Object.values(row));
//     const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
//     worksheet['!merges'] = [
//       {s: {r: 0, c: 0}, e: {r: 0, c: keys.length - 1}}, // Merge cells for the first row
//       {s: {r: 1, c: 0}, e: {r: 1, c: keys.length - 1}}, // Merge cells for the second row
//     ];
//     // Set bold style for the first two rows
//     worksheet['A1'].s = {
//       bold: true,
//       fontSize: 25,
//       horizontal: 'center',
//       vertical: 'center',
//     };
//     worksheet['A2'].s = {
//       bold: true,
//       fontSize: 25,
//       horizontal: 'center',
//       vertical: 'center',
//     };

//     // Add the worksheet to the workbook
//     XLSX.utils.book_append_sheet(workbook, worksheet, 'Attendance Report');

//     // Convert the workbook to a binary string
//     const excelData = XLSX.write(workbook, {type: 'base64', bookType: 'xlsx'});

//     // Create a directory for storing the file
//     const directory = RNFS.DocumentDirectoryPath; // Use the document directory for saving files
//     await RNFS.mkdir(directory);

//     // Define the file path
//     const filePath = `${directory}/${filename}.xlsx`;

//     // Write the binary string to the file
//     await RNFS.writeFile(filePath, excelData, 'base64');

//     // Share the file with the user
//     await Share.open({
//       url: `file://${filePath}`,
//       type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
//     });

//     return filePath;
//   } catch (error) {
//     console.error('Error generating Excel file:', error);
//     throw error;
//   }
// };
