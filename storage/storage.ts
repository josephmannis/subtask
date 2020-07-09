import { ITask } from "../lib/client";
import { AsyncStorage } from "react-native";
import { IPersistedTask } from "../lib/api";

interface ITaskStorage {
    getTopLevelTasks: () => Promise<ITask[]>;
    getTask: (id: string) => Promise<ITask>;
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
    let roots = await AsyncStorage.getItem('root');
    if (roots) {
        let parsed: string[] = JSON.parse(roots); // list of IDs
        return getTasks(parsed);
    }
    return []
}

async function getTasks(ids: string[]): Promise<ITask[]> {
    return await Promise.all(ids.map(id => getTask(id)))
}

async function getTask(id: string): Promise<ITask> {
    let task: IPersistedTask = await getPersisted(id);
    return resolveTask(task);
}

async function getPersisted(id: string): Promise<IPersistedTask> {
    let task: string | null = await AsyncStorage.getItem(id);

    if (task) {
        return JSON.parse(task);
    }

    throw Error(`No task with id ${id}`);
}

async function resolveTask(task: IPersistedTask): Promise<ITask> {
    let percentCompleted = await getPercentCompleted(task.id);

    return {
        ...task,
        percentCompleted: percentCompleted
    }
}

async function getPercentCompleted(id: string): Promise<number> {
    let task: IPersistedTask = await getPersisted(id);
    let numChildren = task.children.length;

    // Is node? 
    if (numChildren === 0) return task.completed ? 1 : 0

    // No, get children.
    let children: ITask[] = await getTasks(task.children)
    let numCompleted = 0

    children.forEach(c => { if (c.percentCompleted === 1) numCompleted += 1 })

    return numCompleted / numChildren;
}

async function toggleTask(id: string): Promise<ITask> {
    let persisted: IPersistedTask = await getPersisted(id);
    await AsyncStorage.setItem(persisted.id, JSON.stringify({...persisted, completed: !persisted.completed}));
    await updateParent(persisted.parentId);
    
    // need to toggle all children?
    return getTask(id);
}

async function updateParent(id?: string): Promise<void> {
    if (id) {
        let persisted: IPersistedTask = await getPersisted(id);
        let percentCompleted = await getPercentCompleted(id);
        let isComplete = percentCompleted === 1
        if ((isComplete && !persisted.completed) || (!isComplete && persisted.completed)) {
            await AsyncStorage.setItem(persisted.id, JSON.stringify({...persisted, completed: isComplete}));
            await updateParent(persisted.parentId)
        }
    }
}
