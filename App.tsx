import { StatusBar } from 'expo-status-bar';
import React from 'react';
import TaskManager from './components/connector/task-manager/TaskManager';
import Portal from '@burstware/react-native-portal';
import { MenuProvider } from 'react-native-popup-menu';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ITaskNavigationParameters } from './lib/client';

const TaskStack = createStackNavigator<ITaskNavigationParameters>();

export default function App() {
  return (
    <NavigationContainer>
      <MenuProvider>
        <Portal.Host>
          <StatusBar style='dark'/>
          <TaskStack.Navigator headerMode='none'>
            <TaskStack.Screen name='Task' initialParams={undefined} component={TaskManager}/>
          </TaskStack.Navigator>
        </Portal.Host>
      </MenuProvider>
    </NavigationContainer>
  );
}
