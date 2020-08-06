import React from 'react';
import { ITaskFragment } from '../../../lib/client';
import { FlatList } from 'react-native';
import { List, ChildTask } from './style';

interface ITaskListProps {
    tasks: ITaskFragment[];
    renderTask: (task: ITaskFragment) => JSX.Element;
}

const TaskList: React.FC<ITaskListProps> = ({ tasks, renderTask }) => {

    return (
        <FlatList
            style={List}
            data={tasks} renderItem={({ item }) => {
                return (
                    <ChildTask>
                        {renderTask(item)}
                    </ChildTask>
                )
            }} />
    )
}

export default TaskList;