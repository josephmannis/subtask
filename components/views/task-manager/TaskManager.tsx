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
        storage.saveTask({name: 'Test', id: 'testid', percentCompleted: 10})
        storage.saveTask({name: 'Child test', id: 'testidchild', parentId: 'testid', percentCompleted: 0})
        storage.saveTask({name: 'Child test2', id: 'testidchild2', parentId: 'testid', percentCompleted: 30})

        storage.getTopLevelTasks()
        .then(tasks => setChildren(tasks))
        .catch(err => console.log(err))
    }, [])

    const setVisibleTask = async (id: string) => {
        let storage = getStorage();
        let task = await storage.getTask(id);
        if (task) {
            let children = await storage.getChildren(task);
            if (children.length === 0) {
                /*
                    - if a task has no children and its completed, its incomplete and update parent
                    - if a task has no children and its not completed, its complete and update parent
                    - if a task has children, go into its children
                */
                await storage.saveTask({...task, percentCompleted: 100});
            } else {
                setChildren(children)
                setTask(task)
            }
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