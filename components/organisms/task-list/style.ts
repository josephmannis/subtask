import { StyleProp, ViewStyle } from "react-native";
import styled from "styled-components/native";

export const List: StyleProp<ViewStyle> = { paddingVertical: 24, marginVertical: 12, marginHorizontal: -24 }

export const ChildTask = styled.View`
    padding: 0 24px;
    margin-bottom: 24px;
`