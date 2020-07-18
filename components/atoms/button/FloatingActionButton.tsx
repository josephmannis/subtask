import React from 'react';
import { CircleButton, ButtonWrapper } from './styles';
import Icon from '../icon/Icon';

interface FloatingActionButtonProps {
    onPress: () => void;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = props => {
    return (
        <ButtonWrapper>
            <CircleButton onPress={props.onPress}>
                <Icon type='plus' size='small'/>
            </CircleButton>
        </ButtonWrapper>
    )
}

export default FloatingActionButton;