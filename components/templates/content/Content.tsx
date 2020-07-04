import React from 'react';
import { Wrapper } from './styled';

const Content: React.FC = props => {
    return (
        <Wrapper>
            {props.children}
        </Wrapper>
    )
}

export default Content;