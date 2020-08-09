import React from 'react';
import { ITaskFragment, ITaskRouteProps, ITaskHistoryItem } from '../../../lib/client';
import useStorage from '../../../storage/storage';
import DisconnectedTaskView from '../../views/task-manager/TaskView';
import { useNavigation, useRoute, useFocusEffect, StackActions, useNavigationState } from '@react-navigation/native';
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
        const pushAction = StackActions.push('Task', { id: task.id, label: task.name });
        navigation.dispatch(pushAction)
    }

    const historyItemPressed = (task: ITaskHistoryItem) => {
        let hist = getHistory()
        let position = hist.length - (hist.findIndex(item => item.id === task.id) + 1)
        const pushAction = StackActions.pop(position)
        navigation.dispatch(pushAction)
    }

    const homePressed = () => {
        const pushAction = StackActions.popToTop()
        navigation.dispatch(pushAction)
    }

    const onTaskCreated = (name: string) => {
        storage.createTask(name, selectedTask?.id)
        .then(() => refresh())
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
                navigation.setParams({id: task.id, label: text})
            })
        }
    }

    const getHistory = (): ITaskHistoryItem[] => {
        let routes: ITaskHistoryItem[] = []
        history.forEach(item => {if (item !== undefined) routes.push(item)})
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