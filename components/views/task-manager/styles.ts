import styled from "styled-components/native";
import { StyleProp, ViewStyle } from "react-native";
import Icon from "../../atoms/icon/Icon";

export const TaskName = styled.TextInput`
    font-size: 42px;
    display: flex;
    font-weight: bold;
    margin-bottom: 20%;
`

export const TaskFilter = styled.TextInput`
    font-size: 16px;
    padding: 12px;
    width: 100%;
    background-color: #E8E8E8;
    border-radius: 7px;
`

export const ChildTask = styled.TouchableHighlight`
    margin-bottom: 16px;
    border-radius: 14px;
`

export const TaskList: StyleProp<ViewStyle> = {overflow: 'visible', marginTop: 32}

export const History: StyleProp<ViewStyle> = {overflow: 'visible', marginBottom: 18}

export const HistoryHome = styled.View`
    display: flex;
    flex-direction: row;
    align-items: center;
`

