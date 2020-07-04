import React from 'react';
import { Wrapper } from './styled';
import { LinearGradient } from 'expo-linear-gradient';

const Content: React.FC = props => {
    return (
        <Wrapper>
            {/* <LinearGradient colors={['', '']}/> */}
            {props.children}
        </Wrapper>
    )
}

export default Content;