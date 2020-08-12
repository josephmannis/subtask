import React from 'react';
import { View } from 'react-native';
import { EmptyStateHint } from './styles';
import { Image } from 'react-native';
const emptyImage = require('../../../assets/empty-state-light.png')

const EmptyState: React.FC = () => {
    return (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Image source={emptyImage} style={{width: 250, height: 250, resizeMode: 'contain', marginBottom: 20}}/>
            <EmptyStateHint>
                Nothing to see here! {"\n"} Click the + below to create a new task.
            </EmptyStateHint>
        </View>
    )
}

export default EmptyState;