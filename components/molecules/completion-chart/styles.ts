import styled from "styled-components/native";

export const ChartWrapper = styled.View`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
`

export const CompletedCircle = styled.View`
    background-color: white;
    shadow-color: black;
    shadow-radius: 16px;
    shadow-opacity: .2;
    elevation: 12;
    border-radius: 500px;
    height: 58%;
    width: 58%;
    position: absolute;
    align-self: center;
    display: flex;
    align-items: center;
    justify-content: center;
`

export const CompletedText = styled.Text`
    font-size: 18px;
    font-weight: 800;
`

export const CompletedIcon = styled.View`
    width: 14px;
`