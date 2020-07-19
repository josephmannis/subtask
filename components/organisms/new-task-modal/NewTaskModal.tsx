import React from 'react';
import CardModal from '../card-modal/CardModal';
import { InputLabel, Input } from '../../atoms/input/TextInput';


interface INewTaskModalProps {
    show: boolean;
    onSubmit: (name: string) => void;
    onCancel: () => void;
}

const NewTaskModal: React.FC<INewTaskModalProps> = ({show, onSubmit, onCancel}) => {
    const [name, setName] = React.useState('');

    return (
        <CardModal title='Create Task' visible={show} confirmText='Create' rejectionText='Cancel' onAccepted={() => onSubmit(name)} onRejected={() => onCancel()}>
            <InputLabel>Name</InputLabel>
            <Input placeholder={'Give your task a name!'} onChangeText={(t) => setName(t)}/>
        </CardModal>
    )
}

export default NewTaskModal;