import { ITaskFragment } from "../lib/client";
import AsyncStorage from "@react-native-community/async-storage";
import { IPersistedTask } from "../lib/api";
import { nanoid } from 'nanoid/async/index';

const ROOT_KEY = 'ROOTS'

interface ITaskStorage {
    getTopLevelTasks: () => Promise<IPersistedTask[]>;
    getTask: (id: string) => Promise<IPersistedTask>;
    getChildren: (id: string) => Promise<IPersistedTask[]>;
    toggleTask: (id: string) => Promise<IPersistedTask>;
    createTask: (name: string, parentId?: string) => Promise<IPersistedTask>
    deleteTask: (id: string) => Promise<void>;
    editTaskName: (id: string, name: string) => Promise<IPersistedTask>;
    init(): Promise<void>;
}
// Add task fragment, so automatically resolve one level deep
// Or maybe we just get the whole ass thing once, and then just move around on the in-memory tree?

export default function useStorage(): ITaskStorage {
    return {
        getTopLevelTasks: getTopLevelTasks,
        getTask: getTask,
        getChildren: getChildren,
        init: init,
        createTask: createTask,
        toggleTask: toggleTask,
        deleteTask: deleteTask,
        editTaskName: editTaskName,
    }
}

async function init(): Promise<void> {
    await AsyncStorage.clear()
    await save({name: 'Eggs', id: 'Eggs', parentId: 'Dairy', percentCompleted: 0, children: []})
    await save({ name: 'Cheese', id: 'Cheese', parentId: 'Dairy', percentCompleted: 0, children: []})
    await save({ name: 'Dairy', id: 'Dairy', parentId: 'Groceries', percentCompleted: 0, children: ['Cheese', 'Eggs']})
    await save({ name: 'Lettuce', id: 'Lettuce', parentId: 'Groceries', percentCompleted: 1, children: []})
    await save({ name: 'Groceries', id: 'Groceries', percentCompleted: .5, children: ['Lettuce', 'Dairy']})
    await AsyncStorage.setItem(ROOT_KEY, JSON.stringify(['Groceries']))
}

async function getTopLevelTasks(): Promise<IPersistedTask[]> {
    let roots = await getRoots();
    return getTasks(roots);
}

async function getTask(id: string): Promise<IPersistedTask> {
    return await getPersisted(id);
}

async function getTasks(ids: string[]): Promise<IPersistedTask[]> {
    return await Promise.all(ids.map(id => getTask(id)))
}

async function getChildren(id: string): Promise<IPersistedTask[]> {
    let task: IPersistedTask = await getPersisted(id);
    return getTasks(task.children);
}

async function getRoots(): Promise<string[]> {
    let roots = await AsyncStorage.getItem(ROOT_KEY);
    if (roots) {
        return JSON.parse(roots); // list of IDs
    } else {
        await AsyncStorage.setItem(ROOT_KEY, JSON.stringify([]));
        return [];
    }
}

async function setRoots(ids: string[]): Promise<string[]> {
    await AsyncStorage.setItem(ROOT_KEY, JSON.stringify(ids));
    return ids;
}

async function addRoot(id: string): Promise<void> {
    let roots = await getRoots();
    roots = [...roots, id]
    await setRoots(roots)
}

async function getPersisted(id: string): Promise<IPersistedTask> {
    let task: string | null = await AsyncStorage.getItem(id);

    if (task) {
        return JSON.parse(task);
    }

    throw Error(`No task with id ${id}`);
}

async function toggleTask(id: string): Promise<IPersistedTask> {
    let persisted: IPersistedTask = await getPersisted(id);
    let newPercentCompleted = persisted.percentCompleted === 1 ? 0 : 1
    await setTaskStatus(id, newPercentCompleted)
    await updateParent(persisted.parentId)
    return getTask(id);
}

async function setTaskStatus(id: string, percentCompleted: number): Promise<void> {
    let persisted: IPersistedTask = await getPersisted(id);
    await save({ ...persisted, percentCompleted: percentCompleted});
    await Promise.all(persisted.children.map(id => setTaskStatus(id, percentCompleted)));
}

async function updateParent(id?: string): Promise<void> {
    if (id) {
        let persisted: IPersistedTask = await getPersisted(id);
        let truePercentCompleted = await calculatePercentCompleted(id);
        let cachedPercentCompleted = persisted.percentCompleted;
        if (cachedPercentCompleted !== truePercentCompleted) {
            await save({ ...persisted, percentCompleted: truePercentCompleted })
            await updateParent(persisted.parentId)
        }
    }
}

async function calculatePercentCompleted(id: string): Promise<number> {
    let task: IPersistedTask = await getPersisted(id);
    let numChildren = task.children.length;

    // Is node? 
    if (numChildren === 0) return task.percentCompleted

    // No, get children.
    let children: ITaskFragment[] = await getTasks(task.children)
    let numCompleted = 0

    children.forEach(c => { if (c.percentCompleted === 1) numCompleted += 1 })

    return numCompleted / numChildren;
}

async function deleteTask(id: string): Promise<void> {
    let persisted: IPersistedTask = await getPersisted(id);
    await setRoots((await getRoots()).filter(rootId => rootId !== id))

    if (persisted.parentId) {
        let parent: IPersistedTask = await getPersisted(persisted.parentId);
        await save({...parent, children: parent.children.filter(t => t !== id)})
    }
    
    await updateParent(persisted.parentId)

    await deleteChildren(id);
}

async function deleteChildren(id: string): Promise<void> {
    let persisted: IPersistedTask = await getPersisted(id);
    await AsyncStorage.removeItem(persisted.id);
    await Promise.all(persisted.children.map(c => deleteChildren(c)))
}

async function createTask(name: string, parentId?: string): Promise<IPersistedTask> {
    let task: IPersistedTask = {
        id: await nanoid(),
        name: name,
        percentCompleted: 0,
        children: [],
        parentId: parentId
    }

    await save(task)
    
    if (parentId) {
        let persisted: IPersistedTask = await getPersisted(parentId);
        persisted = {
            ...persisted,
            children: [...persisted.children, task.id]
        }
        await save(persisted)
        await updateParent(parentId)
    } else {
        await addRoot(task.id)
    }

    return task
}

async function save(task: IPersistedTask): Promise<void> {
    AsyncStorage.setItem(task.id, JSON.stringify(task))
}

async function editTaskName(id: string, name: string): Promise<IPersistedTask> {
    let persisted: IPersistedTask = await getPersisted(id);
    let updated = {
        ...persisted,
        name: name
    }
    await save(updated);

    return await getTask(id);
}