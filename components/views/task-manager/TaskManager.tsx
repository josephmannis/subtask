import React from 'react';
import { TaskName, ChildTask, TaskList } from './styles';
import { View, FlatList } from 'react-native';
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
            <TaskList data={childTasks} keyExtractor={t => t.id} renderItem={t => {
                return (
                    <ChildTask>
                        <TaskCard name={t.item.name} description='test' completion={10}/>
                    </ChildTask>
                )
            }}/>
        </View>
    )
}

export default TaskManager;