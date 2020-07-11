import React from 'react';
import {PieChart } from 'react-native-chart-kit';
import { ChartWrapper, CompletedCircle, CompletedText, CompletedIcon } from './styles';
import Icon from '../../atoms/icon/Icon';


interface ICompletionChartProps {
    // Number between  0 and 1
    percentCompleted: number;
}

const CompletionChart: React.FC<ICompletionChartProps> = ({percentCompleted}) => {
    const getCompleted = () => {
        return percentCompleted < 0 ? 0 : percentCompleted * 100;
    }

    const getData = () => {
        let complete = getCompleted()

        return [
            { 
                completed: complete, 
                color: '#20A3FF', 
            },
            { 
                completed: 100 - complete, 
                color: '#F8F8F8',
            }
        ]
    }

    const getCompletedLabelContents = () => {   
        let complete = getCompleted()
     
        switch(complete) {
            case 100:
                return (<Icon type='check' size='small'/>)
            case 0:
                return
            default:
                return (
                    <CompletedText>
                        {`${complete}%`} 
                    </CompletedText>
                )
        }
    }

    return (
        <ChartWrapper>
            <PieChart
                data={getData()}
                width={100} // from react-native
                height={100}
                accessor="completed"
                hasLegend={false}
                paddingLeft={25}
                
                chartConfig={{color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`}}
            />
            <CompletedCircle>
                { getCompletedLabelContents() }
            </CompletedCircle>        
        </ChartWrapper>
    )
}

export default CompletionChart;