import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CreateListDialogComponent } from '../create-list-dialog/create-list-dialog.component';
import { Task } from '../tasks/tasks.component';

interface TodoList {
  id:number;
  name:string;
  completed:boolean;
  tasks:Task[];
  latestTaskId:number;
}

@Component({
  selector: 'app-to-do-lists',
  templateUrl: './to-do-lists.component.html',
  styleUrls: ['./to-do-lists.component.scss']
})
export class ToDoListsComponent implements OnInit {

  public todos:TodoList[] = []

  constructor(
    private httpClient:HttpClient,
    private router:Router,
    private dialog:MatDialog
  ) { }

  public ngOnInit(): void {
    this.httpClient.get<TodoList[]>('http://localhost:3000/todos')
      .subscribe(res => {
        this.todos = res;
      });
  }

  public getIncompleteTasksCount(tasks:Task[]) {
    let count = tasks.filter(task => !task.completed).length
    return count;
  }

  public openList(listName:string) {
    this.router.navigateByUrl(`/todos/${listName}/tasks`);
  }

  public createList(name:string) {
    const body = { name };
    this.httpClient.post<TodoList>('http://localhost:3000/todos', body)
      .subscribe(
        list => this.todos.push(list),
        name => console.log(`List ${name} already exists. Input a unique name`));
  }

  public deleteList(list:TodoList) {
    this.httpClient.delete<string>(`http://localhost:3000/todos/${list.name}`)
      .subscribe(res => {
        this.todos = this.todos.filter(list => list.id !== list.id);
      })
  }

  public completeList(list:TodoList) {
    this.httpClient.put<TodoList>(`http://localhost:3000/todos/${list.name}`, { details: {completed: true}})
      .subscribe(res => {
        for(let i = 0; i < this.todos.length; i++) {
          if (this.todos[i].id === res.id) {
              this.todos[i] = res;
          }
          break;
        }
      })
  }

  public addList() {
    this.dialog.open(CreateListDialogComponent, {
      width: '400px',
      height: '400px'
    }).afterClosed()
      .subscribe((name:string) => {
        this.httpClient.post<TodoList>('http://localhost:3000/todos', {name})
          .subscribe(list => this.todos.push(list));
      });
  }
}
