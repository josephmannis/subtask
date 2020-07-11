export interface IPersistedTask {
    id: string; // ID of task
    name: string; // Name of task
    parentId?: string;
    completed: boolean;
    children: string[]; 
}