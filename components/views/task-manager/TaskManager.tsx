import React from 'react';
import { TaskName } from './styles';
import { View, Text, AsyncStorage } from 'react-native';
import SearchBar from '../../molecules/search-bar/SearchBar';
import { ITask } from '../../../lib/client';
import getStorage from '../../../storage/storage';
import TaskCard from '../../molecules/task-card/TaskCard';

const TaskManager: React.FC = () => {
    const [ selectedTask, setTask ] = React.useState<ITask | undefined>()
    const [ childTasks, setChildren ] = React.useState<ITask[]>([]);
    const [ childQuery, setQuery ] = React.useState('');

    React.useEffect(() => {
        let storage = getStorage();
        storage.saveTask({name: 'Test', id: 'testid', percentCompleted: 10, children: []})
        storage.getTopLevelTasks()
        .then(tasks => setChildren(tasks))
        .catch(err => console.log(err))
    }, [])

    return (
        <View>
            <TaskName>
                {selectedTask ? selectedTask.name : 'Tasks'}
            </TaskName>

            <SearchBar value={childQuery} onChange={(t) => setQuery(t)}/>
            { childTasks.map((t, i) => {
                return <TaskCard key={i} name={t.name} description='test' completion={10}/>
            })}
        </View>
    )
}

export default TaskManager;