import React from 'react';
import Card from '../../atoms/card/Card';
import { Description, Name, Information, Content } from './styles';
import CompletionChart from '../completion-chart/CompletionChart';

interface ITaskCardProps {
    name: string;
    description: string;
    completion: number;
}

const TaskCard: React.FC<ITaskCardProps> = ({name, description, completion}) => {
    return (
        <Card>
            <Content>
                <CompletionChart percentCompleted={completion}/>
                <Information>
                    <Name>
                        {name}
                    </Name>
                    <Description>
                        {description}    
                    </Description> 
                </Information>
            </Content>
        </Card>
    )
}

export default TaskCard;