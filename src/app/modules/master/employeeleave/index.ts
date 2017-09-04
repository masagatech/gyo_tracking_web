import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard, SharedComponentModule } from '@services';

import { AddEmployeeLeaveComponent } from './aded/addemplv.comp';
import { ViewEmployeeLeaveComponent } from './view/viewemplv.comp';
import { PendingEmployeeLeaveComponent } from './pending/pendemplv.comp';
import { ApprovalEmployeeLeaveComponent } from './approval/appremplv.comp';

import { EmployeeLeaveService } from '@services/master';

import { LazyLoadEvent, DataTableModule, AutoCompleteModule, FileUploadModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: ViewEmployeeLeaveComponent, canActivate: [AuthGuard],
        data: { "module": "pentt", "submodule": "emplv", "rights": "view", "urlname": "/employeeleave" }
      },
      {
        path: 'add', component: AddEmployeeLeaveComponent, canActivate: [AuthGuard],
        data: { "module": "pentt", "submodule": "emplv", "rights": "add", "urlname": "/add" }
      },
      {
        path: 'edit/:id', component: AddEmployeeLeaveComponent, canActivate: [AuthGuard],
        data: { "module": "pentt", "submodule": "emplv", "rights": "edit", "urlname": "/edit" }
      },
      {
        path: 'pending', component: PendingEmployeeLeaveComponent, canActivate: [AuthGuard],
        data: { "module": "pentt", "submodule": "emplvappr", "rights": "view", "urlname": "/pending" }
      },
      {
        path: 'approval/:empid', component: ApprovalEmployeeLeaveComponent, canActivate: [AuthGuard],
        data: { "module": "pentt", "submodule": "emplvappr", "rights": "view", "urlname": "/approval" }
      },
    ]
  },
];

@NgModule({
  declarations: [
    AddEmployeeLeaveComponent,
    ViewEmployeeLeaveComponent,
    PendingEmployeeLeaveComponent,
    ApprovalEmployeeLeaveComponent
  ],

  imports: [
    CommonModule, FormsModule, RouterModule.forChild(routes), SharedComponentModule, DataTableModule, AutoCompleteModule, FileUploadModule
  ],

  providers: [AuthGuard, EmployeeLeaveService]
})

export class EmployeeLeaveModule {
  public static routes = routes;
}
