export interface TodoList {
    id:number;
    name:string;
    completed:boolean;
    tasks:Task[];
    latestTaskId:number;
}

export interface Task {
    id:number;
    description:string;
    dueDate:Date;
    priority:Priority;
    completed:boolean;
}

export enum Priority {
    HIGH = 'high',
    MEDIUM = 'medium',
    LOW = 'low'
};

export class ListsController {
    private todos:Map<string, TodoList> = new Map();
    private latestTodoListId = 0;

    public getLists() {
        return Array.from(this.todos.values());
    }

    public getList(name:string) {
        if (!this.todos.has(name)) {
            throw new Error('List does not exist');
        }
        else {
            return this.todos.get(name);
        }
    }

    public createList(name:string) {
        if (this.todos.has(name)) {
            throw new Error('List name already exists!');
        }
        else {
            this.todos.set(name, {
                id: this.latestTodoListId++,
                name,
                completed: false,
                tasks: [],
                latestTaskId: 0
            });

            console.log(`Created new list: ${name}`);
            return this.todos.get(name);
        }
    }

    public editList(name:string, details:Partial<TodoList>) {
        if (!this.todos.has(name)) {
            throw new Error('List does not exist');
        }
        else {
            const update:TodoList = {...this.todos.get(name), ...details};
            if (details.name) {
                this.todos.delete(name);
                this.todos.set(details.name, update);
            }
            else {
                this.todos.set(name, update);
            }
            return update;
        }
    }

    public deleteList(name:string) {
        if (!this.todos.has(name)) {
            throw new Error('List with that name does not exist!');
        }
        else {
            this.todos.delete(name);
            return name;
        }
    }

    public getTasks(listName:string) {
        if (!this.todos.has(listName)) {
            throw new Error('List with that name does not exist!');
        }
        else {
            return this.todos.get(listName).tasks;
        }
    }

    public addTask(listName:string, details:Pick<Task, 'description' | 'dueDate' | 'priority'>) {
        if (!this.todos.has(listName)) {
            throw new Error('List with that name does not exist!');
        }
        else {
            const list = this.todos.get(listName);
            // default due date is one month from today
            let defaultDueDate = new Date();
            defaultDueDate.setDate(defaultDueDate.getDate() + 30);

            
            const newTask:Task = {
                id: list.latestTaskId++,
                description: details.description,
                dueDate: details.dueDate || defaultDueDate,
                priority: details.priority || Priority.MEDIUM,
                completed: false
            }
            list.tasks.push(newTask);
            
            return newTask;
        }
    }

    public updateTask(listName:string, details:Partial<Task>) {
        if (!this.todos.has(listName)) {
            throw new Error('List with that name does not exist!');
        }
        else {
            let tasks = this.todos.get(listName).tasks;

            for(let i = 0; i < tasks.length; i++) {
                if (tasks[i].id === details.id) {
                    const updatedTask = {...tasks[i], ...details};
                    tasks[i] = updatedTask;
                    return updatedTask;
                }
            }
        }
    }

    public deleteTask(listName:string, taskId:number) {
        if (!this.todos.has(listName)) {
            throw new Error('List with that name does not exist');
        }
        else {
            const tasks = this.todos.get(listName).tasks;
            const deleteTaskIndex = tasks.indexOf(tasks.find(task => task.id === taskId));
            tasks.splice(deleteTaskIndex, 1);
            return tasks;
        }
    }
}