import React from 'react';
import { TaskName, ChildTask, TaskList } from './styles';
import { View, AsyncStorage } from 'react-native';
import SearchBar from '../../molecules/search-bar/SearchBar';
import { ITask } from '../../../lib/client';
import getStorage from '../../../storage/storage';
import TaskCard from '../../molecules/task-card/TaskCard';

const TaskManager: React.FC = () => {
    const [ selectedTask, setTask ] = React.useState<ITask | undefined>()
    const [ childTasks, setChildren ] = React.useState<ITask[]>([]);
    const [ childQuery, setQuery ] = React.useState('');
    const [ history, setHistory ] = React.useState<ITask[]>([]);

    React.useEffect(() => {
        let storage = getStorage();

        storage.getTopLevelTasks()
        .then(tasks => setChildren(tasks))
        .catch(err => console.log(err))
    }, [])

    const setVisibleTask = async (id: string) => {
        let storage = getStorage();
        let task = await storage.getTask(id);
        if (task) {
            let children = await storage.getChildren(task);
            setChildren(children)
            setTask(task)
        }
    }

    return (
        <View>
            <TaskName>
                {selectedTask ? selectedTask.name : 'Tasks'}
            </TaskName>

            <SearchBar value={childQuery} onChange={(t) => setQuery(t)}/>
            <TaskList data={childTasks} keyExtractor={t => t.id} renderItem={t => {
                return (
                    <ChildTask onPress={() => setVisibleTask(t.item.id)}>
                        <TaskCard name={t.item.name} description='test' completion={t.item.percentCompleted}/>
                    </ChildTask>
                )
            }}/>
        </View>
    )
}

export default TaskManager;