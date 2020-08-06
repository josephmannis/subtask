import React from 'react';
import { ITaskFragment } from '../../../lib/client';
import useStorage from '../../../storage/storage';

const RootView: React.FC = props => {
    const [tasks, setTasks] = React.useState<ITaskFragment[]>([])
    const storage = useStorage();
    
    const fetchRoot = async () => {
        storage.init().then(() => {
            storage.getTopLevelTasks()
                .then(tasks => { setTasks(tasks) })
                .catch(err => console.log(err))
        });
    }

    return (
        <div></div>
    )
}

export default RootView;