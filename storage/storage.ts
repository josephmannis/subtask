import { ITaskFragment } from "../lib/client";
import AsyncStorage from "@react-native-community/async-storage";
import { IPersistedTask } from "../lib/api";
import { nanoid } from 'nanoid/async/index';

const ROOT_KEY = 'ROOTS'

interface ITaskFragmentStorage {
    getTopLevelTasks: () => Promise<ITaskFragment[]>;
    getTask: (id: string) => Promise<ITaskFragment>;
    getChildren: (id: string) => Promise<ITaskFragment[]>;
    toggleTask: (id: string) => Promise<ITaskFragment>;
    createTask: (name: string, parentId?: string) => Promise<ITaskFragment>
    deleteTask: (id: string) => Promise<void>;
    editTaskName: (id: string, name: string) => Promise<ITaskFragment>;
    init(): Promise<void>;
}
// Add task fragment, so automatically resolve one level deep
// Or maybe we just get the whole ass thing once, and then just move around on the in-memory tree?

export default function useStorage(): ITaskFragmentStorage {
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
    // await AsyncStorage.clear()
    // await save({name: 'Eggs', id: 'Eggs', parentId: 'Dairy', completed: false, children: []})
    // await save({name: 'Cheese', id: 'Cheese', parentId: 'Dairy', completed: false, children: []})
    // await save({name: 'Dairy', id: 'Dairy', parentId: 'Groceries', completed: false, children: ['Cheese', 'Eggs']})
    // await save({name: 'Lettuce', id: 'Lettuce', parentId: 'Groceries', completed: true, children: []})
    // await save({name: 'Groceries', id: 'Groceries', completed: false, children: ['Lettuce', 'Dairy']})
    // await AsyncStorage.setItem(ROOT_KEY, JSON.stringify(['Groceries']))
}

async function getTopLevelTasks(): Promise<ITaskFragment[]> {
    let roots = await getRoots();
    return getTasks(roots);
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

async function getTask(id: string): Promise<ITaskFragment> {
    let task: IPersistedTask = await getPersisted(id);
    return resolveTask(task);
}

async function getChildren(id: string): Promise<ITaskFragment[]> {
    let task: IPersistedTask = await getPersisted(id);
    return getTasks(task.children);
}

async function getTasks(ids: string[]): Promise<ITaskFragment[]> {
    return await Promise.all(ids.map(id => getTask(id)))
}

async function getPersisted(id: string): Promise<IPersistedTask> {
    let task: string | null = await AsyncStorage.getItem(id);

    if (task) {
        return JSON.parse(task);
    }

    throw Error(`No task with id ${id}`);
}

async function resolveTask(task: IPersistedTask): Promise<ITaskFragment> {
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
    let children: ITaskFragment[] = await getTasks(task.children)
    let numCompleted = 0

    children.forEach(c => { if (c.percentCompleted === 1) numCompleted += 1 })

    return numCompleted / numChildren;
}

async function toggleTask(id: string): Promise<ITaskFragment> {
    let persisted: IPersistedTask = await getPersisted(id);
    await setTaskStatus(id, !persisted.completed)
    await updateParent(persisted.parentId)
    return getTask(id);
}

async function setTaskStatus(id: string, completed: boolean): Promise<void> {
    let persisted: IPersistedTask = await getPersisted(id);
    await AsyncStorage.setItem(persisted.id, JSON.stringify({...persisted, completed: completed}));
    await Promise.all(persisted.children.map(id => setTaskStatus(id, completed)));
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

async function deleteTask(id: string): Promise<void> {
    let persisted: IPersistedTask = await getPersisted(id);
    await setRoots((await getRoots()).filter(rootId => rootId !== id))

    if (persisted.parentId) {
        let parent: IPersistedTask = await getPersisted(persisted.parentId);
        await save({...parent, children: parent.children.filter(t => t !== id)})
    }
    
    updateParent(persisted.parentId)

    await deleteChildren(id);
}

async function deleteChildren(id: string): Promise<void> {
    let persisted: IPersistedTask = await getPersisted(id);
    await AsyncStorage.removeItem(persisted.id);
    await Promise.all(persisted.children.map(c => deleteChildren(c)))
}

async function createTask(name: string, parentId?: string): Promise<ITaskFragment> {
    let task: IPersistedTask = {
        id: await nanoid(),
        name: name,
        completed: false,
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

    return {
        ...task,
        percentCompleted: 0
    }
}

async function save(task: IPersistedTask): Promise<void> {
    AsyncStorage.setItem(task.id, JSON.stringify(task))
}

async function editTaskName(id: string, name: string): Promise<ITaskFragment> {
    let persisted: IPersistedTask = await getPersisted(id);
    let updated = {
        ...persisted,
        name: name
    }
    await save(updated);

    return await getTask(id);
}