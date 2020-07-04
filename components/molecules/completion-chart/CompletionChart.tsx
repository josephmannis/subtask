import React from 'react';
import {PieChart} from 'react-native-chart-kit';


interface ICompletionChartProps {
    percentCompleted: number;
}

const CompletionChart: React.FC<ICompletionChartProps> = props => {
    const chartConfig = {
        backgroundColor: '#FFFFFF',
        backgroundGradientFrom: '#fb8c00',
        backgroundGradientTo: '#ffa726',
        decimalPlaces: 2, // optional, defaults to 2dp
        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        style: {
            borderRadius: 16
        }
    }

    const getData = (percentComplete: number) => {
        return [
            { 
                name: 'Completed', 
                completed: percentComplete, 
                color: '#20A3FF', 
                legendFontColor: '#7F7F7F', 
                legendFontSize: 15 
            }
        ]
    }

    return (
       <PieChart 
            width={50}
            height={50}
            data={getData(props.percentCompleted)}
            accessor="Completed"
            backgroundColor="white"
            paddingLeft="15"
       />
    )
}

export default CompletionChart;