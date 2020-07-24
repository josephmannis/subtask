import styled from "styled-components/native";
import Card from "../../atoms/card/Card";
import { MenuOptionCustomStyle, MenuOptionsCustomStyle } from "react-native-popup-menu";

const menuPadding = 14;

export const MenuCard = styled(Card)`
    border-radius: 4px;
`

export const PopupMenuOptionStyle: MenuOptionCustomStyle = { optionWrapper: {paddingVertical: menuPadding, paddingHorizontal: menuPadding}, optionText: {fontSize: 16, fontWeight: '600'}}

export const MenuTouchable = {triggerWrapper: {padding: 10}}

export const MenuOptionsWrapper: MenuOptionsCustomStyle = {optionsContainer: {backgroundColor: 'transparent', shadowOpacity: 0}}