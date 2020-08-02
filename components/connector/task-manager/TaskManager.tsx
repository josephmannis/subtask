import React from 'react';
import { TaskName, Page, TaskArea } from './styles';
import SearchBar from '../../molecules/search-bar/SearchBar';
import { ITask, ITaskFragment } from '../../../lib/client';
import getStorage from '../../../storage/storage';
import FloatingActionButton from '../../atoms/button/FloatingActionButton';
import NewTaskModal from '../../organisms/new-task-modal/NewTaskModal';
import Portal from '@burstware/react-native-portal';
import fuzzysearch from '../../../utils/fuzzysearch';
import TaskHistory from '../../organisms/task-history/TaskHistory';
import TaskList from '../../organisms/task-list/TaskList';


const TaskManager: React.FC = () => {
    const [ selectedTask, setTask ] = React.useState<ITask | undefined>()
    const [ childTasks, setChildren ] = React.useState<ITaskFragment[]>([]);
    const [ childQuery, setQuery ] = React.useState('');
    const [ history, setHistory ] = React.useState<ITask[]>([]);
    const [ showCreation, toggleCreation ] = React.useState(false);

    const fetchRoot = async () => {
        let storage = getStorage();
        storage.init().then(() => {
            storage.getTopLevelTasks()
            .then(tasks => {setTask(undefined); setChildren(tasks)})
            .catch(err => console.log(err))
        });
    }

    React.useEffect(() => {
        if (!selectedTask) fetchRoot();
    }, [])

    React.useEffect(() => {
        if (history.length === 0) return
        let task = history[history.length - 1]
        let storage = getStorage();
        storage.getChildren(task.id).then(children => {
            setChildren(children)
            setTask(task)
        });
        
        setQuery('')
    }, [history])

    const taskToggled = (id: string) => {
        let storage = getStorage();
        storage.getTask(id).then(task => {
            if (task) {
                storage.toggleTask(task.id)
                .then(task => setChildren(childTasks.map(t => t.id === task.id ? task : t)))
            }
        });
    }

    const taskSelected = (id: string) => {
        let storage = getStorage();
        storage.getTask(id).then(task => {
            if (task) {
                setHistory([...history, task])
            }
        });
    }

    const historyItemPressed = (id: string) => {
        if (id === selectedTask?.id) return
        let historyItem = history.findIndex(v => v.id === id) + 1
        setHistory(history.slice(0, historyItem))
    }

    const homePressed = () => {
        setHistory([]);
        fetchRoot();
    }

    const onTaskCreated = (name: string) => {
        let storage = getStorage();
        toggleCreation(false);
        storage.createTask(name, selectedTask?.id)
        .then(task => setChildren([...childTasks, task]))
        .catch(err => console.log(err))
    }

    const taskDeleted = (id: string) => {
        let storage = getStorage();
        storage.deleteTask(id)
        .then(() => setChildren(childTasks.filter(t => t.id !== id)))
    }

    const onTitleChanged = (text: string) => {
        if (selectedTask) {
            let storage = getStorage();
            storage.editTaskName(selectedTask.id, text)
            .then(task => {
                setTask(task);
                setHistory(history.map(t => t.id === selectedTask.id ? task : t))
            })
        }
    }

    const getFilteredChildren = () => {
        if (childQuery === '') return childTasks;
        return childTasks.filter(task => fuzzysearch(childQuery, task.name));
    }

    return (
        <Page>
            <TaskName editable={selectedTask !== undefined} onChangeText={(text) => onTitleChanged(text)}>
                {selectedTask ? selectedTask.name : 'Tasks'}
            </TaskName>
            
            <TaskHistory
                history={history.map(t => { return { id: t.id, label: t.name } })} 
                onHomePressed={homePressed}
                onHistoryItemSelected={historyItemPressed}
            />
        
            <SearchBar value={childQuery} onChange={(t) => setQuery(t)}/>
            
            <TaskArea>
                <TaskList 
                    tasks={getFilteredChildren()} 
                    onTaskSelected={taskSelected} 
                    onTaskToggled={taskToggled} 
                    onTaskDeleted={taskDeleted}
                />
            </TaskArea>

            <Portal>
                <FloatingActionButton onPress={() => toggleCreation(true)}/>
            </Portal>

            <NewTaskModal show={showCreation} onSubmit={onTaskCreated} onCancel={() => toggleCreation(false)}/>
        </Page>
    )
}

export default TaskManager;