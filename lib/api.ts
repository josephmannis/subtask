export interface IPersistedTask {
    id: string; // ID of task
    name: string; // Name of task
    parentId?: string;
    percentCompleted: number;
    children: string[]; 
}