import { StatusBar } from 'expo-status-bar';
import React from 'react';
import TaskManager from './components/views/task-manager/TaskManager';
import Content from './components/templates/content/Content';
import Portal from '@burstware/react-native-portal';

export default function App() {
  return (
    <Content>
      <Portal.Host>
        <StatusBar style='dark' />
        <TaskManager/>
      </Portal.Host>
    </Content>
  );
}
