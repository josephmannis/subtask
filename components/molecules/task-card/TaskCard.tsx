import React from 'react';
import { Description, Name, Information, Content, InformationWrapper } from './styles';
import CompletionChart from '../completion-chart/CompletionChart';
import Card from '../../atoms/card/Card';
import PopupMenu, { PopupMenuOption } from '../popup-menu/PopupMenu';

interface ITaskCardProps {
    name: string;
    description: string;
    completion: number;
    onDeleted: () => void;
}

const TaskCard: React.FC<ITaskCardProps> = ({name, description, onDeleted, completion}) => {
    return (
        <Card>
            <Content>
                <CompletionChart percentCompleted={completion}/>
                <InformationWrapper>
                    <Information>
                        <Name>
                            {name}
                        </Name>
                        <Description>
                            {description}    
                        </Description> 
                    </Information>
                    <PopupMenu>
                        <PopupMenuOption text='Delete task' onSelect={onDeleted}/>
                    </PopupMenu>
                </InformationWrapper>
            </Content>
        </Card>
    )
}

export default TaskCard;