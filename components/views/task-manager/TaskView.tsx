import React from 'react';
import { TaskName, Page, TaskArea } from './styles';
import SearchBar from '../../molecules/search-bar/SearchBar';
import { ITaskFragment, ITaskHistoryItem } from '../../../lib/client';
import TaskCard from '../../molecules/task-card/TaskCard';
import FloatingActionButton from '../../atoms/button/FloatingActionButton';
import NewTaskModal from '../../organisms/new-task-modal/NewTaskModal';
import Portal from '@burstware/react-native-portal';
import fuzzysearch from '../../../utils/fuzzysearch';
import TaskHistory from '../../organisms/task-history/TaskHistory';
import TaskList from '../../molecules/task-list/TaskList';

interface DisconnectedTaskViewProps {
    title: string;
    tasks: ITaskFragment[];    
    titleEditable?: boolean;
    history: ITaskHistoryItem[];
    onTitleEdited?: (name: string) => void;
    onHomePressed: () => void;
    onHistoryItemSelected: (task: ITaskHistoryItem) => void;
    onTaskCreated: (name: string) => void;
    onTaskDeleted: (id: string) => void;
    onTaskSelected: (task: ITaskFragment) => void;
    onTaskToggled: (id: string) => void;
}

const DisconnectedTaskView: React.FC<DisconnectedTaskViewProps> = props => {
    const { title, tasks, titleEditable, onTaskCreated, onHomePressed, history, onHistoryItemSelected, onTaskDeleted, onTaskSelected, onTaskToggled, onTitleEdited } = props;
    const [ childQuery, setQuery ] = React.useState('');
    const [ showCreation, toggleCreation ] = React.useState(false);

    const getDisplayedChildren = () => {
        if (childQuery === '') return tasks;
        return tasks.filter(task => fuzzysearch(childQuery, task.name));
    }

    const taskCreated = (name: string) => {
        toggleCreation(false);
        onTaskCreated(name)
    } 

    return (
        <Page>
            <TaskName editable={titleEditable} onChangeText={(text) => { if (onTitleEdited) onTitleEdited(text) }}>
                {title}
            </TaskName>

            <TaskHistory
                history={history.map(t => { return { id: t.id, label: t.label } })}
                onHomePressed={onHomePressed}
                onHistoryItemSelected={onHistoryItemSelected}
            />

            <SearchBar value={childQuery} onChange={(t) => setQuery(t)} />

            <TaskArea>
                <TaskList
                    tasks={getDisplayedChildren()}
                    renderTask={(item) => {
                        return (
                            <TaskCard
                                task={item}
                                onDeleted={() => onTaskDeleted(item.id)}
                                onSelected={() => onTaskSelected(item)}
                                onToggled={() => onTaskToggled(item.id)}
                            />
                        )
                    }}
                />
            </TaskArea>

            <Portal>
                <FloatingActionButton onPress={() => toggleCreation(true)} />
            </Portal>

            <NewTaskModal show={showCreation} onSubmit={taskCreated} onCancel={() => toggleCreation(false)} />
        </Page>
    )
}

export default DisconnectedTaskView;