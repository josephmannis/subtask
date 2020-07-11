export interface ITask {
    id: string; // ID of task
    name: string; // Name of task
    children: string[];
    percentCompleted: number; // Completed or not
}