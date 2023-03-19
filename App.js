import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './src/screen/HomeScreen';
import PlaceScreen from './src/screen/PlaceScreen';
import TrafficScreen from './src/screen/TrafficScreen';
import SurveyScreen from './src/screen/SurveyScreen';
import BepScreen from './src/screen/BepScreen';
import ReviewScreen from './src/screen/ReviewScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
          name='Home'  
          component={HomeScreen}
          options={{
            headerShown: false
          }}
        />
        
        <Stack.Screen 
          name='Place'  
          component={PlaceScreen}
          options={{
            headerShown: false
          }}
        />
        
        <Stack.Screen 
          name='Traffic'  
          component={TrafficScreen}
          options={{
            headerShown: false
          }}
        />
        
        <Stack.Screen 
          name='Survey'  
          component={SurveyScreen}
          options={{
            headerShown: false
          }}
        />
        
        <Stack.Screen 
          name='Bep'  
          component={BepScreen}
          options={{
            headerShown: false
          }}
        />
        
        <Stack.Screen 
          name='Review'  
          component={ReviewScreen}
          options={{
            headerShown: false
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
