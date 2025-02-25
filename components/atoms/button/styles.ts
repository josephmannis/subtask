import styled from "styled-components/native";

export const CircleButton = styled.TouchableOpacity`
    border-radius: 150px;
    height: 68px;
    width: 68px;
    align-items: center;
    justify-content: center;
    background-color: #20A3FF;

    shadow-color: #20A3FF;
    shadow-radius: 12px;
    shadow-opacity: .30;
    elevation: 12;
`

export const ButtonWrapper = styled.View`
    position: absolute;
    right: 30px;
    bottom: 30px;
`