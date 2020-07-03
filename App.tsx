import { StatusBar } from 'expo-status-bar';
import React from 'react';
import Task from './components/views/task/Task';
import Content from './components/templates/content/Content';

export default function App() {
  return (
    <Content>
      <StatusBar style='dark' />
      <Task/>
    </Content>
  );
}
