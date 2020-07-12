import React from 'react';
import { TaskName, ChildTask, TaskList, History, HistoryHome } from './styles';
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

    const taskPressed = async (id: string) => {
        let storage = getStorage();
        let task = await storage.getTask(id);
        if (task) {
            let children = await storage.getChildren(task.id);
            if (children.length === 0) {
                storage.toggleTask(id)
                .then(task => { setChildren(childTasks.map(t => t.id === task.id ? task : t)) })
                .catch(err => console.log(err))
            } else {
                setHistory([...history, task])
                console.log(history)
                setChildren(children)
                setTask(task)
            }
        }
    }

    const parentTaskPressed = (id: string) => {
        if (id === selectedTask?.id) return
        setHistory(history.slice(0, history.findIndex(v => v.id === id) - 1))
        taskPressed(id)
    }

    const homePressed = () => {
        setHistory([]);
        fetchRoot();
    }

    const getDescription = (numChildren: number) => `${ numChildren === 0 ? 'No' : numChildren} subtasks`

    return (
        <View>
            <TaskName>
                {selectedTask ? selectedTask.name : 'Tasks'}
            </TaskName>
            { history.length !== 0 &&
                <FlatList
                    horizontal data={history}
                    style={History}
                    contentContainerStyle={{display: 'flex', alignItems: 'center'}}
                    ItemSeparatorComponent={() => <View style={{alignSelf: 'center'}}><Divider/></View>}
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