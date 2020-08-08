import React from 'react';
import { FlatList } from 'react-native';
import { HistoryContent, HistoryHome, History } from './style';
import Tag from '../../atoms/tag/Tag';
import Divider from '../../atoms/divider/Divider';
import { ITaskHistoryItem } from '../../../lib/client';


interface ITaskHistoryProps {
    history: ITaskHistoryItem[];
    onHomePressed: () => void;
    onHistoryItemSelected: (task: ITaskHistoryItem) => void;
}

const TaskHistory: React.FC<ITaskHistoryProps> = ({history, onHomePressed, onHistoryItemSelected}) => {
    const taskList = React.useRef<FlatList>(null);
    console.log(history)
    return (
        <FlatList
            ref={taskList}
            onContentSizeChange={() => {
                if (taskList.current) taskList.current.scrollToEnd({ animated: true })
            }}
            horizontal data={history}
            style={History}
            contentContainerStyle={HistoryContent}
            ItemSeparatorComponent={() => <Divider />}
            ListHeaderComponent={() => {
                return (
                    <HistoryHome>
                        <Tag onPress={() => onHomePressed()} text={'🏠'} />
                        <Divider />
                    </HistoryHome>
                )
            }}
            renderItem={({ item }) => <Tag onPress={() => onHistoryItemSelected(item)} text={item.label} />}
        />
    )
}

export default TaskHistory;