import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '@services';

import { AddLeaveEmployeeComponent } from './aded/addlvemp.comp';
import { ViewLeaveEmploypeeComponent } from './view/viewlvemp.comp';

import { LeaveEmployeeService } from '@services/master';

import { LazyLoadEvent, DataTableModule, AutoCompleteModule, FileUploadModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      { path: '', component: ViewLeaveEmploypeeComponent, canActivate: [AuthGuard], data: { "module": "pentt", "submodule": "lvemp", "rights": "view", "urlname": "/leaveemployee" } },
      { path: 'add', component: AddLeaveEmployeeComponent, canActivate: [AuthGuard], data: { "module": "pentt", "submodule": "lvemp", "rights": "add", "urlname": "/add" } },
      { path: 'details/:id', component: AddLeaveEmployeeComponent, canActivate: [AuthGuard], data: { "module": "pentt", "submodule": "lvemp", "rights": "edit", "urlname": "/edit" } },
      { path: 'edit/:id', component: AddLeaveEmployeeComponent, canActivate: [AuthGuard], data: { "module": "pentt", "submodule": "lvemp", "rights": "edit", "urlname": "/edit" } }
    ]
  },
];

@NgModule({
  declarations: [
    AddLeaveEmployeeComponent,
    ViewLeaveEmploypeeComponent
  ],

  imports: [
    CommonModule, FormsModule, RouterModule.forChild(routes), DataTableModule, AutoCompleteModule, FileUploadModule
  ],

  providers: [AuthGuard, LeaveEmployeeService]
})

export class LeaveEmployeeModule {
  public static routes = routes;
}
