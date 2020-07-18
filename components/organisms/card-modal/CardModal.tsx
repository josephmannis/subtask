import React from 'react';
import { ReactNativeModal } from 'react-native-modal';
import { View, Text, TouchableOpacity } from 'react-native';
import { Content, Title, ButtonGroup, Accept, Reject, GroupButton } from './styles';

interface ICardModalProps {
    visible: boolean;
    confirmText: string;
    rejectionText: string;
    title: string;
    onAccepted: () => void;
    onRejected: () => void;
}

const CardModal: React.FC<ICardModalProps> = ({visible, confirmText, rejectionText, onAccepted, onRejected, title, children}) => {
    return (
        <ReactNativeModal isVisible={visible}>
            <View style={Content}>
                <Text style={Title}>{title}</Text>
                {children}
                <View style={ButtonGroup}>
                    <TouchableOpacity onPress={onAccepted} style={GroupButton}><Text style={Accept}>{confirmText}</Text></TouchableOpacity>
                    <TouchableOpacity onPress={onRejected} style={GroupButton}><Text style={Reject}>{rejectionText}</Text></TouchableOpacity>
                </View>
            </View>
        </ReactNativeModal>
    )
}

export default CardModal