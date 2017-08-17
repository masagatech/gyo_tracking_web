import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '@services';

import { AddTaskAllocateComponent } from './aded/addtask.comp';
import { ViewTaskAllocateComponent } from './view/viewtask.comp';

import { TaskAllocateService } from '@services/master';

import { LazyLoadEvent, DataTableModule, AutoCompleteModule, FileUploadModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      { path: '', component: ViewTaskAllocateComponent, canActivate: [AuthGuard], data: { "module": "pentt", "submodule": "atsk", "rights": "view", "urlname": "/taskallocate" } },
      { path: 'add', component: AddTaskAllocateComponent, canActivate: [AuthGuard], data: { "module": "pentt", "submodule": "atsk", "rights": "add", "urlname": "/add" } },
      { path: 'details/:id', component: AddTaskAllocateComponent, canActivate: [AuthGuard], data: { "module": "pentt", "submodule": "atsk", "rights": "edit", "urlname": "/edit" } },
      { path: 'edit/:id', component: AddTaskAllocateComponent, canActivate: [AuthGuard], data: { "module": "pentt", "submodule": "atsk", "rights": "edit", "urlname": "/edit" } }
    ]
  },
];

@NgModule({
  declarations: [
    AddTaskAllocateComponent,
    ViewTaskAllocateComponent
  ],

  imports: [
    CommonModule, FormsModule, RouterModule.forChild(routes), DataTableModule, AutoCompleteModule, FileUploadModule
  ],

  providers: [AuthGuard, TaskAllocateService]
})

export class TaskAllocateModule {
  public static routes = routes;
}
