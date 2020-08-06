import React from 'react';
import { Description, Name, Information, Content, InformationWrapper } from './styles';
import CompletionChart from '../completion-chart/CompletionChart';
import Card from '../../atoms/card/Card';
import PopupMenu, { PopupMenuOption } from '../popup-menu/PopupMenu';
import { TouchableOpacity } from 'react-native';
import { ITaskFragment } from '../../../lib/client';

interface ITaskCardProps {
    task: ITaskFragment;
    onDeleted: () => void;
    onToggled: () => void;
    onSelected: () => void;
}

const TaskCard: React.FC<ITaskCardProps> = ({ task, onDeleted, onToggled, onSelected }) => {
    const getDescription = (numChildren: number) => `${numChildren === 0 ? 'No' : numChildren} subtasks`


    return (
        <Card>
            <Content>
                <TouchableOpacity activeOpacity={.4} onPress={onToggled}>
                    <CompletionChart percentCompleted={task.percentCompleted}/>
                </TouchableOpacity>
                <InformationWrapper>
                    <TouchableOpacity activeOpacity={.4} onPress={onSelected}>
                        <Information>
                            <Name>
                                {task.name}
                            </Name>
                            <Description>
                                {getDescription(task.children.length)}    
                            </Description> 
                        </Information>
                    </TouchableOpacity>
                    <PopupMenu>
                        <PopupMenuOption text='Delete task' onSelect={onDeleted}/>
                    </PopupMenu>
                </InformationWrapper>
            </Content>
        </Card>
    )
}

export default TaskCard;