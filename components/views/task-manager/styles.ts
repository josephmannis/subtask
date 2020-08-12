import styled from "styled-components/native";
import { StyleProp, ViewStyle } from "react-native";

export const Page = styled.View`
    flex: 1;
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

export const ChildTask = styled.View`
    padding: 0 24px;
    margin-bottom: 24px;
`

export const TaskArea = styled.SafeAreaView`
    flex: 5;
`

export const History: StyleProp<ViewStyle> = { flex: 2, overflow: 'hidden', marginBottom: 10 }

export const HistoryContent: StyleProp<ViewStyle> = {display: 'flex', alignItems: 'center', marginVertical: 24}

export const HistoryHome = styled.View`
    display: flex;
    flex-direction: row;
    align-items: center;
`