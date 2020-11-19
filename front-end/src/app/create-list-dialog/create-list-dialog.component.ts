import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Task } from '../tasks/tasks.component';

@Component({
  selector: 'app-create-list-dialog',
  templateUrl: './create-list-dialog.component.html',
  styleUrls: ['./create-list-dialog.component.scss']
})
export class CreateListDialogComponent implements OnInit {

  public name = '';

  constructor(
    private dialogRef:MatDialogRef<CreateListDialogComponent>
  ) { }

  public ngOnInit(): void {
  }

  public save() {
    if (!this.name) {
      return;
    }
    this.dialogRef.close(this.name);
  }
}
