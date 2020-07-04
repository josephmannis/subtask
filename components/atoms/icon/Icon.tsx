
import React from 'react';
// import { IconImage } from './styles';
const searchIcon = require('../../../assets/ic_search.png');
import { Image } from 'react-native';
import styled from 'styled-components/native';

type IconType = 'search';

interface IIconProps {
    type: IconType;
}

const mapTypeToIcon = (type: IconType) => {
    switch(type) {
        case 'search':
            return searchIcon
    }
}

const IconImage = styled.Image`
    height: 100%;
    resize-mode: contain;
    width: 5%;
    
`

const Icon: React.FC<IIconProps> = ({type}) => {
    return (
        <IconImage source={mapTypeToIcon(type)}/>
    )
}

export default Icon;