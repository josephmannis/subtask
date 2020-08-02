import React from 'react';
import { TaskName, TaskList, History, HistoryHome, HistoryContent, Page, TaskArea, ChildTask } from './styles';
import { FlatList } from 'react-native';
import SearchBar from '../../molecules/search-bar/SearchBar';
import { ITask, IResolvedTask } from '../../../lib/client';
import getStorage from '../../../storage/storage';
import Tag from '../../atoms/tag/Tag';
import TaskCard from '../../molecules/task-card/TaskCard';
import Divider from '../../atoms/divider/Divider';
import FloatingActionButton from '../../atoms/button/FloatingActionButton';
import NewTaskModal from '../../organisms/new-task-modal/NewTaskModal';
import Portal from '@burstware/react-native-portal';
import fuzzysearch from '../../../utils/fuzzysearch';
import { useNavigationState } from '@react-navigation/native';

interface DisconnectedTaskManagerProps {
    task: IResolvedTask;
    history: {id: string, label: string}[];
    onTaskNameEdited: (name: string) => void;
    onHomePressed: () => void;
    onHistoryItemSelected: (id: string) => void;
    onTaskCreated: (name: string) => void;
    onTaskDeleted: (id: string) => void;
    onTaskSelected: (id: string) => void;
    onTaskToggled: (id: string) => void;
}

// todo different base screen
const DisconnectedTaskManager: React.FC<DisconnectedTaskManagerProps> = props => {
    const { task, history, onTaskCreated, onTaskDeleted, onTaskNameEdited, onTaskSelected, onTaskToggled, onHistoryItemSelected, onHomePressed } = props;
    const [ childQuery, setQuery ] = React.useState('');
    const [ showCreation, toggleCreation ] = React.useState(false);
    const taskList = React.useRef<FlatList>(null);

    const getDescription = (numChildren: number) => `${ numChildren === 0 ? 'No' : numChildren} subtasks`

    const getFilteredChildren = () => {
        const children = task.children;
        if (childQuery === '') return children;
        return children.filter(task => fuzzysearch(childQuery, task.name));
    }

    return (
        <Page>
            <TaskName onChangeText={onTaskNameEdited}>
                {task.name}
            </TaskName>
            {/* Pull this into own component as well */}
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
                                <Tag onPress={() => onHomePressed()} text={'🏠'}/>
                                <Divider/>
                            </HistoryHome>
                        )
                    }}
                renderItem={({ item }) => <Tag onPress={() => onHistoryItemSelected(item.id)} text={item.name}/>}
                />
            }

            <SearchBar value={childQuery} onChange={(t) => setQuery(t)}/>

            {/* TODO pull this into its own component */}
            <TaskArea>
                <FlatList 
                    style={TaskList}
                    data={getFilteredChildren()} renderItem={({item}) => {
                        return (
                            <ChildTask>
                                <TaskCard 
                                    name={item.name}
                                    description={getDescription(item.children.length)} 
                                    completion={item.percentCompleted}
                                    onDeleted={() => onTaskDeleted(item.id)}   
                                    onInformationSelected={() => onTaskSelected(item.id)} 
                                    onProgressSelected={() => onTaskToggled(item.id)}
                                />
                            </ChildTask>
                    )
                }}/>
            </TaskArea>
            <Portal>
                <FloatingActionButton onPress={() => toggleCreation(true)}/>
            </Portal>
            <NewTaskModal show={showCreation} onSubmit={onTaskCreated} onCancel={() => toggleCreation(false)}/>
        </Page>
    )
}

export default DisconnectedTaskManager;