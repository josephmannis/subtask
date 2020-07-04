import React from 'react';
import styled from 'styled-components/native';

const Container = styled.View`
    border-radius: 14px;
    shadow-color: black;
    shadow-radius: 14px;
    shadow-opacity: .15;
    elevation: 12;
    background-color: white;
`

const Card: React.FC = props => {
    return (
        <Container>
            {props.children}
        </Container>
    )
}

export default Card;