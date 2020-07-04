import { ITask } from "../lib/client";
import { AsyncStorage } from "react-native";

interface ITaskStorage {
    getTopLevelTasks: () => Promise<ITask[]>;
    getTask: (id: string) => Promise<ITask | undefined>;
    getChildren: (ask: ITask) => Promise<ITask[]>;
    saveTask: (task: ITask) => Promise<ITask>;
}

export default function getStorage(): ITaskStorage {
    return {
        getTopLevelTasks: getTopLevelTasks,
        saveTask: saveTask,
        getTask: getTask,
        getChildren: getChildren
    }
}

async function getTopLevelTasks(): Promise<ITask[]> {
    const keys = await AsyncStorage.getAllKeys();
    const tasks: ITask[] = await getTasks(keys);
    return tasks.filter(task => !task.parentId);
}

async function getChildren(parent: ITask): Promise<ITask[]> {
    const keys = await AsyncStorage.getAllKeys();
    const tasks: ITask[] = await getTasks(keys);
    return tasks.filter(task => task.parentId === parent.id);
}

async function saveTask(task: ITask): Promise<ITask> {
    const keys = await AsyncStorage.getAllKeys();
    if (task.parentId && !keys.includes(task.parentId)) throw Error('Parent does not exist.')
    return AsyncStorage.setItem(task.id, JSON.stringify(task))
    .then(() => task);
}

async function getTask(id: string): Promise<ITask | undefined> {
    const task = await AsyncStorage.getItem(id);
    if (task) return JSON.parse(task);
}

async function getTasks(ids: string[]): Promise<ITask[]> {
    return AsyncStorage.multiGet(ids).then(items => parseTasks(items));
}

function parseTasks(items: [string, string][]): ITask[] {
    return items.map(i => JSON.parse(i[1]));
}