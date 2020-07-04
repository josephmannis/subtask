
import React from 'react';
const searchIcon = require('../../../assets/ic_search.png');
const checkIcon = require('../../../assets/ic_check.png')
import styled from 'styled-components/native';

type IconType = 'search' | 'check';
type IconSize = 'small';

interface IIconProps {
    type: IconType;
    size: IconSize;
}

const mapTypeToIcon = (type: IconType) => {
    switch(type) {
        case 'search':
            return searchIcon
        case 'check':
            return checkIcon
    }
}

const mapSize = (size: IconSize) => {
    switch(size) {
        case 'small':
            return '20px'
    }
}

interface ImageProps {
    size: IconSize;
}

const IconImage = styled.Image<ImageProps>`
    height: ${({size}) => mapSize(size)};
    width: ${({size}) => mapSize(size)};
    aspect-ratio: 1;
    resize-mode: contain;
`

const Icon: React.FC<IIconProps> = ({type, size}) => {
    return (
        <IconImage source={mapTypeToIcon(type)} size={size}/>
    )
}

export default Icon;