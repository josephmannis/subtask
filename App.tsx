import { StatusBar } from 'expo-status-bar';
import React from 'react';
import TaskManager from './components/views/task-manager/TaskManager';
import Content from './components/templates/content/Content';
import Portal from '@burstware/react-native-portal';
import { MenuProvider } from 'react-native-popup-menu';

export default function App() {
  return (
    <MenuProvider>
      <Portal.Host>
        <Content>
            <StatusBar style='dark' />
            <TaskManager/>
        </Content>
      </Portal.Host>
    </MenuProvider>
  );
}
