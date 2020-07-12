import styled from 'styled-components/native';
import React from 'react';
import {TouchableHighlight} from 'react-native'

const Base = styled.View`
    background-color: #3BA9ED;
    border-radius: 22px;
    display: flex;
    align-items: center;
    padding: 12px 20px;
    align-self: flex-start;
    flex-wrap: nowrap;
    min-width: 100px;

    shadow-color: black;
    shadow-radius: 12px;
    shadow-opacity: .15;
    elevation: 12;
`

const Label = styled.Text`
    color: white;
    font-weight: bold;
    font-size: 16px;
`

const Touchable = styled.TouchableHighlight`
    border-radius: 22px;
`

interface TagProps {
    text: string;
    onPress?: () => void;
}

const Tag: React.FC<TagProps> = props => {
    return (
        <Touchable onPress={props.onPress}>
                <Base>
                    <Label>
                        {props.text}
                    </Label>
                </Base>
        </Touchable>
    )
}

export default Tag;