// App.js
import React, {useEffect, useState} from 'react';
import {
  NavigationContainer,
  View,
  ActivityIndicator,
} from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import LoginScreen from './src/screens/Auth/LoginScreen';
import {checkAuth} from './src/services/authService';

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuthentication = async () => {
      const authenticated = await checkAuth();
      console.log('authenticated');
      console.log(authenticated);
      setIsAuthenticated(authenticated);
      setIsLoading(false);
    };

    checkAuthentication();
  }, []);

  // if (isLoading) {
  //   // You might want to render a loading spinner or splash screen while checking authentication
  //   <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
  //     <ActivityIndicator size="large" color="#0000ff" />
  //   </View>;
  // }
  console.log('isAuthenticated');
  console.log(isAuthenticated);
  return (
    <NavigationContainer>
      {isAuthenticated ? <AppNavigator /> : <LoginScreen />}
    </NavigationContainer>
  );
};

export default App;
