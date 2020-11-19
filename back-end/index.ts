import express = require('express');
import bodyParser = require('body-parser');
import cors = require('cors');
import {
    ListsController,
    Task
} from './lists';

const app = express();
const lists = new ListsController();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

/** Seed todo lists */
const seedLists = ['Groceries', 'Car', 'Workouts'];
seedLists.forEach(list => lists.createList(list));
/** */

/** Routes */

// get all lists
app.get('/todos', (req, res) => {
    return res.status(200)
        .send(lists.getLists());
});

// create new list
app.post('/todos', (req, res) => {
    const listName = req.body.name.trim();

    try {
        return res.status(200)
            .send(lists.createList(listName));
    }
    catch {
        return res.status(409)
            .send(listName);
    }
});

// update list
app.put('/todos/:listName', (req, res) => {
    const listName = req.params.listName;
    const details = req.body.details;

    try {
        return res.status(200)
            .send(lists.editList(listName, details));
    }
    catch {
        return res.status(404)
            .send(listName);
    }
})

// delete list
app.delete('/todos/:listName', (req, res) => {
    const listName = req.params.listName;

    try {
        return res.status(200)
            .send(lists.deleteList(listName));
    }
    catch {
        return res.status(404)
            .send(listName);
    }
});

app.get('/todos/:listName/tasks', (req, res) => {
    const listName = req.params.listName;

    try {
        return res.status(200)
            .send(lists.getTasks(listName));
    }
    catch {
        return res.status(400)
            .send(`List with name ${listName} does not exist!`);
    }
})

// add task
app.post('/todos/:listName/tasks', (req, res) => {
    const listName = req.params.listName;
    const details:Pick<Task, 'description' | 'dueDate' | 'priority'> = req.body.details;

    if (!details.description) {
        return res.status(400)
            .send('Missing required parameter "description"!');
    }
    else {
        try {
            return res.status(200)
                .send(lists.addTask(listName, details));
        }
        catch {
            return res.status(400)
                .send(`Unable to find list with name ${listName}.`);
        }
    }
});

// update task
app.put('/todos/:listName/tasks/:taskId', (req, res) => {
    const listName = req.params.listName;
    const taskId = req.params.taskId;
    const details:Partial<Task> = req.body.details;

    if (!details) { 
        return res.status(400)
            .send('No details to update');
    }
    else {
        try {
            details['id'] = +taskId;
            return res.status(200)
                .send(lists.updateTask(listName, details));
        }
        catch {
            return res.status(400)
                .send(`Unable to find list with name ${listName}`);
        }
    }
});

// delete task
app.delete('/todos/:listName/tasks/:taskId', (req, res) => {
    const listName = req.params.listName;
    const taskId = +req.params.taskId;

    try {
        return res.status(200)
            .send(lists.deleteTask(listName, taskId));
    }
    catch {
        return res.status(400)
            .send(`Unable to find list with name ${listName}`);
    }
});
/** */

const PORT = process.env.PORT || 3000;

app.listen(PORT, () =>
  console.log(`Example app listening on port ${PORT}!`),
);
