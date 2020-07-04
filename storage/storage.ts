import { ITask } from "../lib/client";
import { AsyncStorage } from "react-native";

interface ITaskStorage {
    getTopLevelTasks: () => Promise<ITask[]>;
    getTask: (id: string) => Promise<ITask | undefined>;
    saveTask: (task: ITask) => Promise<ITask>;
}

export default function getStorage(): ITaskStorage {
    return {
        getTopLevelTasks: getTopLevelTasks,
        saveTask: saveTask,
        getTask: getTask
    }
}

async function getTopLevelTasks(): Promise<ITask[]> {
    const keys = await AsyncStorage.getAllKeys();
    const tasks: ITask[] = await 
        AsyncStorage.multiGet(keys)
        .then(items => items.map(i => JSON.parse(i[1])));
    return tasks.filter(task => !task.parentId);
}

async function saveTask(task: ITask): Promise<ITask> {
    return AsyncStorage.setItem(task.id, JSON.stringify(task))
    .then(() => task);
}

async function getTask(id: string): Promise<ITask | undefined> {
    const task = await AsyncStorage.getItem(id);
    if (task) return JSON.parse(task);
}