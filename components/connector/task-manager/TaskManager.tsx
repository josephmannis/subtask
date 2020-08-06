import React from 'react';
import { ITaskFragment, ITaskRouteProps } from '../../../lib/client';
import useStorage from '../../../storage/storage';
import DisconnectedTaskView from '../../views/task-manager/TaskView';
import { useNavigation, useRoute, useFocusEffect, StackActions } from '@react-navigation/native';
import Content from '../../templates/content/Content';


const TaskManager: React.FC = () => {
    const [ selectedTask, setTask ] = React.useState<ITaskFragment | undefined>()
    const [ listedTasks, setListedTasks ] = React.useState<ITaskFragment[]>([])
    const storage = useStorage();
    const navigation = useNavigation();
    const route = useRoute<ITaskRouteProps>();

    useFocusEffect(
        React.useCallback(() => {
            if (route.params) {
                console.log(route.params.id)
                storage.getTask(route.params.id)
                .then(task => setTask(task))
            } else {
                console.log('Setting root')
                setTask(undefined)
            }
    }, []))

    React.useEffect(() => {
        console.log('I get called')
        if (selectedTask) {
            console.log('whats up')
            storage.getChildren(selectedTask.id)
                .then(tasks => setListedTasks(tasks))
        } else {
            console.log('getting top levels')
            storage.getTopLevelTasks()
                .then(tasks => { setListedTasks(tasks) })
                .catch(err => console.log(err))
        }
    }, [selectedTask])

    const taskToggled = (id: string) => {
        storage.getTask(id).then(task => {
            if (task) {
                storage.toggleTask(task.id)
                .then(task => setTask(task))
            }
        });
    }

    const taskSelected = (id: string) => {
        const pushAction = StackActions.push('Task', { id: id, label: 'test' });
        navigation.dispatch(pushAction)
    }

    const historyItemPressed = (id: string) => {
        // if (id === selectedTask?.id) return
        // let historyItem = history.findIndex(v => v.id === id) + 1
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
        storage.deleteTask(id)
            .then(() => setListedTasks(listedTasks.filter(t => t.id !== id)))
    }

    const onTitleChanged = (text: string) => {
        if (selectedTask) {
            storage.editTaskName(selectedTask.id, text)
            .then(task => {
                setTask(task);
                // setHistory(history.map(t => t.id === selectedTask.id ? task : t))
            })
        }
    }

    return (
        <Content>

        <DisconnectedTaskView 
            title={selectedTask ? selectedTask.name : 'Tasks'}
            titleEditable={selectedTask ? true : false}
            tasks={listedTasks}
            // history={history}
            onTitleEdited={onTitleChanged}
            // onHomePressed={homePressed}
            onTaskCreated={onTaskCreated}
            onTaskDeleted={taskDeleted}
            onTaskSelected={taskSelected}
            onTaskToggled={taskToggled}
        />
        </Content>

    )
}

export default TaskManager;