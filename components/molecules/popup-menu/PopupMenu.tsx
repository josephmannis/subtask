import React from 'react';
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
  } from 'react-native-popup-menu';
import { MenuCard, PopupMenuOptionStyle, MenuTouchable, MenuOptionsWrapper } from './styles';
import Icon from '../../atoms/icon/Icon';

const PopupMenu: React.FC = props => {
    return (
        <Menu>
            <MenuTrigger customStyles={MenuTouchable}>
                <Icon type='kebab' size='small'/>
            </MenuTrigger>
            <MenuOptions customStyles={MenuOptionsWrapper}>
                <MenuCard>
                    {props.children}
                </MenuCard>
            </MenuOptions>
        </Menu>
    )
}

export interface IPopupMenuOptionProps {
    text: string;
    onSelect: () => void;
}

export const PopupMenuOption: React.FC<IPopupMenuOptionProps> = ({text, onSelect}) => {
    return (
        <MenuOption customStyles={PopupMenuOptionStyle} onSelect={onSelect} text={text} />
    )
}

export default PopupMenu;