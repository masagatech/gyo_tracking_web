import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '../../../_services/authguard-service';

import { AddAllocateTaskComponent } from './aded/addtask.comp';
import { ViewAllocateTaskComponent } from './view/viewtask.comp';

import { AllocateTaskService } from '@services/master';

import { LazyLoadEvent, DataTableModule, AutoCompleteModule, FileUploadModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      { path: '', component: ViewAllocateTaskComponent, canActivate: [AuthGuard], data: { "module": "pentt", "submodule": "atsk", "rights": "view", "urlname": "/AllocateTask" } },
      { path: 'add', component: AddAllocateTaskComponent, canActivate: [AuthGuard], data: { "module": "pentt", "submodule": "atsk", "rights": "add", "urlname": "/add" } },
      { path: 'details/:id', component: AddAllocateTaskComponent, canActivate: [AuthGuard], data: { "module": "pentt", "submodule": "atsk", "rights": "edit", "urlname": "/edit" } },
      { path: 'edit/:id', component: AddAllocateTaskComponent, canActivate: [AuthGuard], data: { "module": "pentt", "submodule": "atsk", "rights": "edit", "urlname": "/edit" } }
    ]
  },
];

@NgModule({
  declarations: [
    AddAllocateTaskComponent,
    ViewAllocateTaskComponent
  ],

  imports: [
    CommonModule, FormsModule, RouterModule.forChild(routes), DataTableModule, AutoCompleteModule, FileUploadModule
  ],

  providers: [AuthGuard, AllocateTaskService]
})

export class AllocateTaskModule {
  public static routes = routes;
}
