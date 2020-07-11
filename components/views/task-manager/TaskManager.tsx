import React from 'react';
import { TaskName, ChildTask, TaskList } from './styles';
import { View } from 'react-native';
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
        async function setupTasks() {
            let storage = getStorage();
            storage.init().then(() => {
                storage.getTopLevelTasks()
                .then(tasks => setChildren(tasks))
                .catch(err => console.log(err))
            });
        }

        setupTasks();
    }, [])

    const taskPressed = async (id: string) => {
        let storage = getStorage();
        let task = await storage.getTask(id);
        if (task) {
            let children = await storage.getChildren(task.id);
            if (children.length === 0) {
                storage.toggleTask(id)
                .then(task => {setChildren(childTasks.map(t => t.id === task.id ? task : t))})
                .catch(err => console.log(err))
            } else {
                setChildren(children)
                setTask(task)
            }
        }
    }

    const getDescription = (numChildren: number) => `${ numChildren === 0 ? 'No' : numChildren} subtasks`

    return (
        <View>
            <TaskName>
                {selectedTask ? selectedTask.name : 'Tasks'}
            </TaskName>

            <SearchBar value={childQuery} onChange={(t) => setQuery(t)}/>
            <TaskList data={childTasks} keyExtractor={t => t.id} renderItem={t => {
                return (
                    <ChildTask onPress={() => taskPressed(t.item.id)}>
                        <TaskCard name={t.item.name} description={getDescription(t.item.children.length)} completion={t.item.percentCompleted}/>
                    </ChildTask>
                )
            }}/>
        </View>
    )
}

export default TaskManager;