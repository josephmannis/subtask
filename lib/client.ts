import { StackScreenProps } from "@react-navigation/stack"
import { RouteProp } from "@react-navigation/native"

export interface ITask {
    id: string; // ID of task
    name: string; // Name of task
    percentCompleted: number; // Completed or not
}

export interface ITaskFragment extends ITask {
    children: string[]; // List of ids
}

export interface IResolvedTask extends ITask {
    children: ITaskFragment[]; // List of resolved tasks
}

export interface ITaskHistoryItem {
    id: string;
    label: string;
}

export type ITaskNavigationParameters = {
    Task: (ITaskHistoryItem | undefined)
}

export type ITaskRouteProps = RouteProp<ITaskNavigationParameters, 'Task'> 
export type ITaskNavigatorProps = StackScreenProps<ITaskNavigationParameters, 'Task'>