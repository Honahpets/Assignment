import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TasksComponent } from './tasks/tasks.component';
import { ToDoListsComponent } from './to-do-lists/to-do-lists.component';

const routes: Routes = [{
    path: 'todos',
    component: ToDoListsComponent
  }, {
    path: 'todos/:listName/tasks',
    component: TasksComponent
  }, {
    path: '',
    redirectTo: '/todos',
    pathMatch: 'full'
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
