import React from 'react';
import { ITaskFragment } from '../../../lib/client';
import { FlatList } from 'react-native';
import { List, ChildTask } from './style';
import TaskCard from '../../molecules/task-card/TaskCard';

interface ITaskListProps {
    tasks: ITaskFragment[];
    onTaskSelected: (id: string) => void;
    onTaskToggled: (id: string) => void;
    onTaskDeleted: (id: string) => void;
}

const TaskList: React.FC<ITaskListProps> = ({ tasks, onTaskSelected, onTaskToggled, onTaskDeleted }) => {
    const getDescription = (numChildren: number) => `${numChildren === 0 ? 'No' : numChildren} subtasks`

    return (
        <FlatList
            style={List}
            data={tasks} renderItem={({ item }) => {
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
            }} />
    )
}

export default TaskList;