import { StyleProp, ViewStyle, TextStyle } from "react-native";

export const Content: StyleProp<ViewStyle> = { 
    borderRadius: 14,
    padding: 24,
    backgroundColor: '#FFFFFF',
}

export const Title: StyleProp<TextStyle> = { 
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 14
}

export const ButtonGroup: StyleProp<ViewStyle> = {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 24
}

export const GroupButton: StyleProp<ViewStyle> = {
    width: '50%',
    alignItems: 'center'
}

const ButtonLabel: StyleProp<TextStyle> = {
    fontWeight: 'bold',
    fontSize: 18,
}

export const Accept: StyleProp<TextStyle> = {
    ...ButtonLabel,
    color: '#20A3FF'
}

export const Reject: StyleProp<TextStyle> = {
    ...ButtonLabel,
    color: '#FF5656'
}