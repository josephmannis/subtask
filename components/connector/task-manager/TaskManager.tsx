import React from 'react';
import { ITaskFragment, ITaskRouteProps, ITaskNavigationParameters, ITaskHistoryItem } from '../../../lib/client';
import useStorage from '../../../storage/storage';
import DisconnectedTaskView from '../../views/task-manager/TaskView';
import { useNavigation, useRoute, useFocusEffect, StackActions, useNavigationState, NavigationState, NavigationProp, Route } from '@react-navigation/native';
import Content from '../../templates/content/Content';


const TaskManager: React.FC = () => {
    const [ selectedTask, setTask ] = React.useState<ITaskFragment | undefined>()
    const [ listedTasks, setListedTasks ] = React.useState<ITaskFragment[]>([])
    const storage = useStorage();
    const navigation = useNavigation();
    const route = useRoute<ITaskRouteProps>();
    const history = useNavigationState<(ITaskHistoryItem | undefined)[]>(state => state.routes.map(r => r.params as ITaskHistoryItem))

    useFocusEffect(React.useCallback(() => refresh(), []))

    React.useEffect(() => {
        if (selectedTask) {
            storage.getChildren(selectedTask.id)
                .then(tasks => setListedTasks(tasks))
        }
    }, [selectedTask])

    const refresh = () => {
        if (route.params) {
            storage.getTask(route.params.id)
                .then(task => setTask(task))
        } else {
            setTask(undefined);
            storage.getTopLevelTasks()
                .then(tasks => { setListedTasks(tasks) })
                .catch(err => console.log(err))
        }
    }

    const taskToggled = (id: string) => {
        storage.getTask(id).then(task => {
            if (task) {
                storage.toggleTask(task.id)
                .then(task => setTask(task))
            }
        });
    }

    const taskSelected = (task: ITaskFragment) => {
        // console.log(task)
        const pushAction = StackActions.push('Task', { id: task.id, label: task.name });
        navigation.dispatch(pushAction)
    }

    const historyItemPressed = (task: ITaskHistoryItem) => {
        // console.log(task)
        // if (id === selectedTask?.id) return
        // let historyItem = history.findIndex(v => v.id === id) + 1
    }

    const homePressed = () => {
        let hist = navigation.dangerouslyGetState().routes.map(r => r.params as ITaskHistoryItem)

        console.log(hist)
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

    const getHistory = (): ITaskHistoryItem[] => {
        let hist = navigation.dangerouslyGetState().routes.map(r => r.params as ITaskHistoryItem)
        // console.log(hist)
        let routes: ITaskHistoryItem[] = []
        hist.forEach(item => {if (item !== undefined) routes.push(item)})
        // console.log(routes)
        return routes;
    }

    return (
        <Content>

        <DisconnectedTaskView 
            title={selectedTask ? selectedTask.name : 'Tasks'}
            titleEditable={selectedTask ? true : false}
            tasks={listedTasks}
            history={getHistory()}
            onHistoryItemSelected={historyItemPressed}
            onTitleEdited={onTitleChanged}
            onHomePressed={homePressed}
            onTaskCreated={onTaskCreated}
            onTaskDeleted={taskDeleted}
            onTaskSelected={taskSelected}
            onTaskToggled={taskToggled}
        />
        </Content>

    )
}

export default TaskManager;