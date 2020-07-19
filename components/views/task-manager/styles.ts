import styled from "styled-components/native";
import { StyleProp, ViewStyle } from "react-native";

export const Page = styled.View`
    /* height: 100%; */
`

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
    padding: 0 24px;
`

export const TaskList: StyleProp<ViewStyle> = {overflow: 'hidden', paddingVertical: 24, marginVertical: 12, marginHorizontal: -24}

export const History: StyleProp<ViewStyle> = { overflow: 'hidden', marginBottom: 10 }

export const HistoryContent: StyleProp<ViewStyle> = {display: 'flex', alignItems: 'center', marginVertical: 24}

export const HistoryHome = styled.View`
    display: flex;
    flex-direction: row;
    align-items: center;
`

