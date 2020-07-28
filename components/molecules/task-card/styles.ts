import styled from "styled-components/native";

export const Content = styled.View`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 8px;
`

export const InformationWrapper = styled.View`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    flex: 2;
    padding: 0 8px;
`

export const Information = styled.View`
    display: flex;
    flex-direction: column;
`

export const Name = styled.Text`
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 8px;
`

export const Description = styled.Text`
    font-size: 18px;
    color: #20A3FF;
`