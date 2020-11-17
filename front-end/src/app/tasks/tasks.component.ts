import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { CreateEditTaskDialogComponent } from '../create-edit-task-dialog/create-edit-task-dialog.component';

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

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent implements OnInit {
  public listName = '';
  public tasks:Task[] = [];

  public tasks$:Observable<Task[]> = new Observable;

  constructor(
    private httpClient:HttpClient,
    private route:ActivatedRoute,
    private dialog:MatDialog
  ) { }

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        switchMap(params => {
            this.listName = params.get('listName') || '';
            return this.httpClient.get<Task[]>(`http://localhost:3000/todos/${this.listName}/tasks`)
        })
      ).subscribe(tasks => this.tasks = tasks);
  }

  public createTask() {
    this.dialog.open(CreateEditTaskDialogComponent, {
      width: '400px',
      height: '400px'
    }).afterClosed()
      .subscribe((res:Partial<Task>) => {
        this.httpClient.post<Task>(`http://localhost:3000/todos/${this.listName}/tasks`, {details: res})
          .subscribe(res => this.tasks.push(res));
      });
  }

  public completeTask(task:Task) {
    this.httpClient.put<Task>(`http://localhost:3000/todos/${this.listName}/tasks/${task.id}`, {details: {completed: true}})
      .subscribe(res => this.updateTask(res))
  }

  public editTask(task:Task) {
    this.dialog.open(CreateEditTaskDialogComponent, {
      width: '400px',
      height: '400px',
      data: {
        task
      }
    }).afterClosed()
      .subscribe((res:Partial<Task>) => {
        console.log(res);
        this.httpClient.put<Task>(`http://localhost:3000/todos/${this.listName}/tasks/${task.id}`, {details: res})
          .subscribe(res => this.updateTask(res))
      })
  }

  public deleteTask(task:Task) {
    this.httpClient.delete<Task[]>(`http://localhost:3000/todos/${this.listName}/tasks/${task.id}`)
      .subscribe(res => this.tasks = res);
  }

  private updateTask(task:Task) {
    for(let i = 0; i < this.tasks.length; i++) {
      if (this.tasks[i].id === task.id) {
          this.tasks[i] = task;
      }
      break;
    }
  }

}
