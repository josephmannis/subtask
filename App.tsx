import { StatusBar } from 'expo-status-bar';
import React from 'react';
import TaskManager from './components/connector/task-manager/TaskManager';
import Content from './components/templates/content/Content';
import Portal from './components/connector/task-manager/node_modules/@burstware/react-native-portal';
import { MenuProvider } from 'react-native-popup-menu';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';


export default function App() {
  return (
    <NavigationContainer>
      <MenuProvider>
        <Portal.Host>
          <Content>
              <StatusBar style='dark' />
              <TaskManager/>
          </Content>
        </Portal.Host>
      </MenuProvider>
    </NavigationContainer>
  );
}
