export interface ITask {
    id: string; // ID of task
    parentId?: string; // ID of parent
    name: string; // Name of task
    percentCompleted: number; // Completed or not
}