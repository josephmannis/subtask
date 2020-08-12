import React from 'react';
import { ITaskFragment } from '../../../lib/client';
import { FlatList } from 'react-native';
import { List, ChildTask } from './style';
import EmptyState from '../empty-state/EmptyState';

interface ITaskListProps {
    tasks: ITaskFragment[];
    renderTask: (task: ITaskFragment) => JSX.Element;
}

const TaskList: React.FC<ITaskListProps> = ({ tasks, renderTask }) => {

    return (
        <FlatList
            style={List}
            scrollEnabled={tasks.length !== 0}
            ListEmptyComponent={() => <EmptyState/>}
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