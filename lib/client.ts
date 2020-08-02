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