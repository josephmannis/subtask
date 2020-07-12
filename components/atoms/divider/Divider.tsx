import React from 'react';
import styled from 'styled-components/native';
import Icon from '../icon/Icon';


export const Base = styled.View`
    margin: 0px 12px;
`
const Divider: React.FC = props => {
    return (
        <Base>
            <Icon size='small' type='arrow'/>
        </Base>
    )
}

export default Divider;