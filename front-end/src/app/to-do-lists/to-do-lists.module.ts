import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToDoListsComponent } from './to-do-lists.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { MatButtonModule } from '@angular/material/button';
import { CreateListDialogComponent } from '../create-list-dialog/create-list-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [ToDoListsComponent, CreateListDialogComponent],
  imports: [
    CommonModule,
    BrowserModule,
    HttpClientModule,
    MatButtonModule,
    MatDialogModule,
    FormsModule
  ]
})
export class ToDoListsModule { }
