import { StyleProp, ViewStyle } from "react-native"
import styled from "styled-components/native"

export const History: StyleProp<ViewStyle> = { flex: 2, overflow: 'hidden', marginBottom: 10 }

export const HistoryContent: StyleProp<ViewStyle> = { display: 'flex', alignItems: 'center', marginVertical: 24 }

export const HistoryHome = styled.View`
    display: flex;
    flex-direction: row;
    align-items: center;
`

