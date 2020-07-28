import React from 'react';
import { Description, Name, Information, Content, InformationWrapper, InformationTouchable } from './styles';
import CompletionChart from '../completion-chart/CompletionChart';
import Card from '../../atoms/card/Card';
import PopupMenu, { PopupMenuOption } from '../popup-menu/PopupMenu';

interface ITaskCardProps {
    name: string;
    description: string;
    completion: number;
    onDeleted: () => void;
    onProgressSelected: () => void;
    onInformationSelected: () => void;
}

const TaskCard: React.FC<ITaskCardProps> = ({name, description, onDeleted, onProgressSelected, onInformationSelected, completion}) => {
    return (
        <Card>
            <Content>
                <InformationTouchable activeOpacity={.4} onPress={onProgressSelected}>
                    <CompletionChart percentCompleted={completion}/>
                </InformationTouchable>
                <InformationWrapper>
                    <InformationTouchable activeOpacity={.4} onPress={onInformationSelected}>
                        <Information>
                            <Name>
                                {name}
                            </Name>
                            <Description>
                                {description}    
                            </Description> 
                        </Information>
                    </InformationTouchable>
                    <PopupMenu>
                        <PopupMenuOption text='Delete task' onSelect={onDeleted}/>
                    </PopupMenu>
                </InformationWrapper>
            </Content>
        </Card>
    )
}

export default TaskCard;