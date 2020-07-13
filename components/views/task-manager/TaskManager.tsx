import React from 'react';
import { TaskName, ChildTask, TaskList, History, HistoryHome, HistoryContent } from './styles';
import { View, FlatList } from 'react-native';
import SearchBar from '../../molecules/search-bar/SearchBar';
import { ITask } from '../../../lib/client';
import getStorage from '../../../storage/storage';
import Tag from '../../atoms/tag/Tag';
import TaskCard from '../../molecules/task-card/TaskCard';
import Divider from '../../atoms/divider/Divider';

const TaskManager: React.FC = () => {
    const [ selectedTask, setTask ] = React.useState<ITask | undefined>()
    const [ childTasks, setChildren ] = React.useState<ITask[]>([]);
    const [ childQuery, setQuery ] = React.useState('');
    const [ history, setHistory ] = React.useState<ITask[]>([]);

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
        let endHistory = history.findIndex(v => v.id === id) + 1
        setHistory(history.slice(0, endHistory))
    }

    const homePressed = () => {
        setHistory([]);
        fetchRoot();
    }

    const getDescription = (numChildren: number) => `${ numChildren === 0 ? 'No' : numChildren} subtasks`

    return (
        <View>
            <TaskName editable={selectedTask !== undefined}>
                {selectedTask ? selectedTask.name : 'Tasks'}
            </TaskName>
            { history.length !== 0 &&
                <FlatList
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
                    <ChildTask onPress={() => taskPressed(item.id)}>
                        <TaskCard name={item.name} description={getDescription(item.children.length)} completion={item.percentCompleted}/>
                    </ChildTask>
                )
            }}/>
        </View>
    )
}

export default TaskManager;