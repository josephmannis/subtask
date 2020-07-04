import React from 'react';
import { CircleButton } from './styles';

interface FloatingActionButtonProps {
    onPress: () => void;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = props => {
    return (
        <CircleButton onPress={props.onPress}>
            
        </CircleButton>
    )
}

export default FloatingActionButton;