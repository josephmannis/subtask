import React from 'react';
import { ITaskFragment, IResolvedTask } from '../../../lib/client';
import useStorage from '../../../storage/storage';
import DisconnectedTaskView from '../../views/task-manager/TaskView';


const TaskManager: React.FC = () => {
    const [ selectedTask, setTask ] = React.useState<IResolvedTask | undefined>()
    const [ listedTasks, setTasks ] = React.useState<ITaskFragment[]>([])
    const [ history, setHistory ] = React.useState<ITaskFragment[]>([]);
    const storage = useStorage();
    
    // React.useEffect(() => {
    //     if (!selectedTask) fetchRoot();
    // }, [])

    // React.useEffect(() => {
    //     if (history.length === 0) return
    //     let task = history[history.length - 1]
    //     storage.getChildren(task.id).then(children => {
    //         setChildren(children)
    //         setTask(task)
    //     });
    // }, [history])

    React.useEffect(() => {
        if (selectedTask) {
            setTasks(selectedTask.children);
        } else {
            storage.getTopLevelTasks()
                .then(tasks => { setTask(undefined); setTasks(tasks) })
                .catch(err => console.log(err))
        }
    }, [selectedTask])

    const taskToggled = (id: string) => {
        let storage = getStorage();
        storage.getTask(id).then(task => {
            if (task) {
                storage.toggleTask(task.id)
                .then(task => setTask(task))
            }
        });
    }

    const taskSelected = (id: string) => {
        let storage = getStorage();
        storage.getTask(id).then(task => {
            if (task) {
                setHistory([...history, task])
            }
        });
    }

    const historyItemPressed = (id: string) => {
        if (id === selectedTask?.id) return
        let historyItem = history.findIndex(v => v.id === id) + 1
        setHistory(history.slice(0, historyItem))
    }

    const homePressed = () => {
        // setHistory([]);
        // fetchRoot();
    }

    const onTaskCreated = (name: string) => {
        storage.createTask(name, selectedTask?.id)
        .then(task => setTask(task))
        .catch(err => console.log(err))
    }

    const taskDeleted = (id: string) => {
        let storage = getStorage();
        storage.deleteTask(id)
        .then(() => setTasks(listedTasks.filter(t => t.id !== id)))
    }

    const onTitleChanged = (text: string) => {
        if (selectedTask) {
            let storage = getStorage();
            storage.editTaskName(selectedTask.id, text)
            .then(task => {
                setTask(task);
                setHistory(history.map(t => t.id === selectedTask.id ? task : t))
            })
        }
    }

    return (
        <DisconnectedTaskView 
            title={selectedTask ? selectedTask.name : 'Tasks'}
            titleEditable={selectedTask ? true : false}
            tasks={listedTasks}
            history={history}
            onTitleEdited={onTitleChanged}
            onHomePressed={homePressed}
            onTaskCreated={onTaskCreated}
            onTaskDeleted={taskDeleted}
            onTaskSelected={taskSelected}
            onTaskToggled={taskToggled}
        />
    )
}

export default TaskManager;