import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import home from './home';
import CardScan from './CardScan';
const Stack = createStackNavigator();
console.disableYellowBox = true;
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="home" component={home} options={{ headerShown: false }} />
        <Stack.Screen name="Card Scan" component={CardScan} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

