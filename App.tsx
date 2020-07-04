import { StatusBar } from 'expo-status-bar';
import React from 'react';
import TaskManager from './components/views/task-manager/TaskManager';
import Content from './components/templates/content/Content';

export default function App() {
  return (
    <Content>
      <StatusBar style='dark' />
      <TaskManager/>
    </Content>
  );
}
