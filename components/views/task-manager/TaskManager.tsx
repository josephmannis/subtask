import React from 'react';
import { TaskName, ChildTask, TaskList, History, HistoryHome, HistoryContent, Page } from './styles';
import { FlatList } from 'react-native';
import SearchBar from '../../molecules/search-bar/SearchBar';
import { ITask } from '../../../lib/client';
import getStorage from '../../../storage/storage';
import Tag from '../../atoms/tag/Tag';
import TaskCard from '../../molecules/task-card/TaskCard';
import Divider from '../../atoms/divider/Divider';
import FloatingActionButton from '../../atoms/button/FloatingActionButton';
import NewTaskModal from '../../organisms/new-task-modal/NewTaskModal';
import Portal from '@burstware/react-native-portal';

const TaskManager: React.FC = () => {
    const [ selectedTask, setTask ] = React.useState<ITask | undefined>()
    const [ childTasks, setChildren ] = React.useState<ITask[]>([]);
    const [ childQuery, setQuery ] = React.useState('');
    const [ history, setHistory ] = React.useState<ITask[]>([]);
    const [ showCreation, toggleCreation ] = React.useState(false);
    const taskList = React.useRef<FlatList>(null);

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
    }, [history])

    const taskPressed = (id: string) => {
        let storage = getStorage();
        storage.getTask(id).then(task => {
            if (task) {
                if (task.children.length === 0) {
                    storage.toggleTask(task.id)
                    .then(task => setChildren(childTasks.map(t => t.id === task.id ? task : t)))
                } else {
                    setHistory([...history, task])
                }
            }
        });
    }

    const parentTaskPressed = (id: string) => {
        if (id === selectedTask?.id) return
        let historyItem = history.findIndex(v => v.id === id) + 1
        setHistory(history.slice(0, historyItem))
    }

    const homePressed = () => {
        setHistory([]);
        fetchRoot();
    }

    const getDescription = (numChildren: number) => `${ numChildren === 0 ? 'No' : numChildren} subtasks`

    const onTaskCreated = (name: string) => {
        let storage = getStorage();
        toggleCreation(false);
        storage.createTask(name, selectedTask?.id)
        .then(task => setChildren([...childTasks, task]))
        .catch(err => console.log(err))
    }

    return (
        <Page>
            <TaskName editable={selectedTask !== undefined}>
                {selectedTask ? selectedTask.name : 'Tasks'}
            </TaskName>
            { history.length !== 0 &&
                <FlatList
                    ref={taskList}
                    onContentSizeChange={() => {
                       if (taskList.current) taskList.current.scrollToEnd({animated: true})
                    }}
                    horizontal data={history}
                    style={History}
                    contentContainerStyle={HistoryContent}
                    ItemSeparatorComponent={() => <Divider/>}
                    ListHeaderComponent={() =>  {
                        return (
                            <HistoryHome>
                                <Tag onPress={() => homePressed()} text={'🏠'}/>
                                <Divider/>
                            </HistoryHome>
                        )
                    }}
                    renderItem={({item}) => <Tag onPress={() => parentTaskPressed(item.id)} text={item.name}/>}
                />
            }

            <SearchBar value={childQuery} onChange={(t) => setQuery(t)}/>
            
            <FlatList 
                style={TaskList}
                data={childTasks} renderItem={({item}) => {
                return (
                    <ChildTask activeOpacity={0} underlayColor={'white'} onPress={() => taskPressed(item.id)}>
                        <TaskCard name={item.name} description={getDescription(item.children.length)} completion={item.percentCompleted}/>
                    </ChildTask>
                )
            }}/>
            <Portal>
                <FloatingActionButton onPress={() => toggleCreation(true)}/>
            </Portal>
            <NewTaskModal show={showCreation} onSubmit={onTaskCreated} onCancel={() => toggleCreation(false)}/>
        </Page>
    )
}

export default TaskManager;