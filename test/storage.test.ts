import getStorage from "../storage/storage"
import AsyncStorage from "@react-native-community/async-storage";

jest.mock('nanoid/async/index')
const { nanoid } = require('nanoid/async/index')

let storage = getStorage();
const DEFAULT_ID = 'taskid'

beforeEach(() => {
    storage = getStorage();
    nanoid.mockReturnValue(new Promise<string>((resolve) => resolve(DEFAULT_ID))) 
})

afterEach(() => {
    return AsyncStorage.clear() 
})

const mockId = (id: string) => nanoid.mockReturnValueOnce(new Promise<string>((resolve) => resolve(id)))  
const mockXIds = (prefix: string, amount: number) => {
    for (let i = 0; i < amount; i++) {
        mockId(`${prefix}${i}`)
    }
}

// Fetching logic: roots
test('Top level tasks returns empty array when there are no top level tasks', async () => {
    let tasks = await storage.getTopLevelTasks()
    expect(tasks).toStrictEqual([])
})

test('Top level tasks returns non-empty array after new task with no parent is created', async () => {
    let task = await storage.createTask('test');
    let roots = await storage.getTopLevelTasks()
    expect(roots).toContainEqual(task)
})


// // Fetching logic, non-roots
test('Getting a task that doesnt exist throws an error', async () => {
    expect(storage.getTask('idk')).rejects.toEqual(new Error())
})

test('Getting a task that does exist returns the correct task', async () => {
    let task = await storage.createTask('test')
    expect(storage.getTask(DEFAULT_ID)).resolves.toEqual(task)
})

test('Getting a task with no children has an empty child array', async () => {
    let task = await storage.createTask('test')
    expect(task.children).toEqual([])
})

// // Fetching roots
test('Fetching children for a given task returns the correct children', async () => {
    mockId(DEFAULT_ID)
    mockId('child')
    await storage.createTask('test')
    let child = await storage.createTask('child', DEFAULT_ID)
    expect(storage.getChildren(DEFAULT_ID)).resolves.toEqual(child)  
})

// // Toggling logic
test('Completing all of a tasks children makes the task complete', async () => {
    mockId(DEFAULT_ID)
    mockId('child')
    await storage.createTask('test')
    let child = await storage.createTask('child', DEFAULT_ID)
    await storage.toggleTask(child.id)
    let task = await storage.getTask(DEFAULT_ID)
    expect(task.percentCompleted).toEqual(1)
})

test('A task completed by all of its being completed completes its parent', async () => {
    mockId('parent')
    mockId('child')
    mockId('child1')

    await storage.createTask('test')
    await storage.createTask('child', 'parent')
    await storage.createTask('child1', 'child')
    await storage.toggleTask('child1')
    let topLevelParent = await storage.getTask('parent')
    expect(topLevelParent.percentCompleted).toEqual(1)
})

test('Toggling a task without children completes it', async () => {
    await storage.createTask('test')
    await storage.toggleTask(DEFAULT_ID)
    let task = await storage.getTask(DEFAULT_ID)
    expect(task.percentCompleted).toEqual(1)
})

test('Toggling a task with children completes it', async () => {
    mockId('parent')
    mockId('child')
    await storage.createTask('test')
    await storage.createTask('child', 'parent')
    let task = await storage.toggleTask('parent')
    expect(task.percentCompleted).toEqual(1)
})

test('A task with children completed by toggling it completes its parent', async () => {
    mockId('parent')
    mockId('child')
    mockId('child1')

    await storage.createTask('test')
    await storage.createTask('child', 'parent')
    await storage.createTask('child1', 'child')
    await storage.toggleTask('child')
    let topLevelParent = await storage.getTask('parent')
    expect(topLevelParent.percentCompleted).toEqual(1)
})

test('Toggling a completed child task uncompletes its parent', async () => {
    mockId('parent')
    mockId('child')
    await storage.createTask('test')
    await storage.createTask('child', 'parent')
    await storage.toggleTask('parent')
    let task = await storage.toggleTask('parent')
    expect(task.percentCompleted).toEqual(0)
})

test('Toggling a complete task uncompletes it', async () => {
    await storage.createTask('test')
    await storage.toggleTask(DEFAULT_ID)
    let task = await storage.toggleTask(DEFAULT_ID)
    expect(task.percentCompleted).toEqual(0)
})


// // Toggling: percentage
test('A task with fully incomplete childrten has a percentage completed of 0', async () => {
    mockId('parent')
    mockId('child')

    await storage.createTask('parent')
    await storage.createTask('child', 'parent')
    let task = await storage.getTask('parent')
    expect(task.percentCompleted).toEqual(0)
})

test('A task with half incompleted children has a percentage completed of .5', async () => {
    mockId('parent')
    mockId('child')
    mockId('child1')

    await storage.createTask('test')
    await storage.createTask('child', 'parent')
    await storage.createTask('child1', 'parent')
    await storage.toggleTask('child')
    let topLevelParent = await storage.getTask('parent')
    expect(topLevelParent.percentCompleted).toEqual(.5)
})

// // Creation logic
test('Adding a child task updates the percentage completed accordingly', async () => {
    mockId('parent')
    mockId('child')
    mockId('child1')
    mockId('child2')
    mockId('child3')

    await storage.createTask('test')
    await storage.createTask('child', 'parent')
    await storage.createTask('child1', 'parent')
    await storage.toggleTask('child')
    let topLevelParent = await storage.getTask('parent')
    expect(topLevelParent.percentCompleted).toEqual(.5)
    await storage.createTask('child2', 'parent')
    await storage.createTask('child3', 'parent')
    let topLevelParentUpdated = await storage.getTask('parent')
    expect(topLevelParentUpdated.percentCompleted).toEqual(.25)
})

test('Adding a child to a completed task makes the task incomplete', async () => {
    mockId('parent')
    mockId('child')

    await storage.createTask('test')
    await storage.toggleTask('parent')
    await storage.createTask('child', 'parent')
    let task = await storage.getTask('parent')
    expect(task.percentCompleted).toEqual(0)
})

test('Adding a task with no parent preserves all other tasks in the roots', async () => {
    mockId('t1')
    mockId('t2')
    let task1 = await storage.createTask('test')
    let task2 = await storage.createTask('test')
    let expectedRoots = [task1, task2]
    let roots = await storage.getTopLevelTasks()
    expect(roots).toEqual(expectedRoots)
})

test('Adding a task and then fetching it does not throw and error', async () => {
    let created = await storage.createTask('task')
    let fetched = await storage.getTask(DEFAULT_ID)
    expect(created).toEqual(fetched)
})

// // Deletion logic
test('A task is completed by its last child, which is uncompleted, being deleted', async () => {
    mockId('parent')
    mockId('child')
    mockId('child1')

    await storage.createTask('test')
    await storage.createTask('child', 'parent')
    await storage.createTask('child1', 'parent')
    await storage.toggleTask('child')
    let topLevelParent = await storage.getTask('parent')
    expect(topLevelParent.percentCompleted).toEqual(.5)
    await storage.deleteTask('child1')
    let topLevelParentUpdated = await storage.getTask('parent')
    expect(topLevelParentUpdated.percentCompleted).toEqual(1)
})

test('Deleting a top level task removes it from the top level task array', async () => {
    mockId('t1')
    mockId('t2')
    let task1 = await storage.createTask('test')
    await storage.createTask('test')
    let expectedRoots = [task1]
    await storage.deleteTask('t2')
    let roots = await storage.getTopLevelTasks()
    expect(roots).toEqual(expectedRoots)
})

test('Deleting a parent task deletes all of its children', async () => {
    mockId('parent')
    mockId('child')

    await storage.createTask('test')
    await storage.createTask('child', 'parent')
    await storage.deleteTask('parent')
    expect(storage.getTask('child')).rejects.toEqual(new Error())  
})

test('Deleting a task and then fetching it throws an error', async () => {
    mockId('parent')

    await storage.createTask('test')
    await storage.deleteTask('parent')
    expect(storage.getTask('parent')).rejects.toEqual(new Error())  
})

// // Editing name
test('Updating the name for a task persists correctly', async () => {
    mockId('parent')

    await storage.createTask('test')
    await storage.editTaskName('parent', 'hi')
    let task = await storage.getTask('parent')
    expect(task.name).toEqual('hi')
})