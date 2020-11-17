import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Task } from '../tasks/tasks.component';

type Priority = 'low' | 'medium' | 'high';
interface DialogData {
  task:Task
}

@Component({
  selector: 'app-create-edit-task-dialog',
  templateUrl: './create-edit-task-dialog.component.html',
  styleUrls: ['./create-edit-task-dialog.component.scss']
})
export class CreateEditTaskDialogComponent implements OnInit {
  @Input() public task?:Task;

  public get title() {
    return this.task ? 'Edit Task' : 'Create New Task';
  }

  public dueDate = new Date();
  public description = '';
  public priority:Priority = 'medium';

  public priorities = ['low', 'medium', 'high'];

  constructor(
    private dialogRef:MatDialogRef<CreateEditTaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data:DialogData
  ) {
  }

  public ngOnInit(): void {
    if (this.data?.task) {
      console.log(this.data.task);
      this.description = this.data.task.description;
      this.dueDate = this.data.task.dueDate;
    }
  }

  public save() {
    this.dialogRef.close({
      description: this.description,
      dueDate: this.dueDate,
      priority: this.priority
    });
  }
}
