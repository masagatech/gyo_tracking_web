import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '@services';

import { AddEmployeeComponent } from './aded/addemp.comp';
import { ViewEmployeeComponent } from './view/viewemp.comp';

import { EmployeeService } from '@services/master';

import { LazyLoadEvent, DataTableModule, AutoCompleteModule, FileUploadModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      { path: '', component: ViewEmployeeComponent, canActivate: [AuthGuard], data: { "module": "pentt", "submodule": "emp", "rights": "view", "urlname": "/Employee" } },
      { path: 'add', component: AddEmployeeComponent, canActivate: [AuthGuard], data: { "module": "pentt", "submodule": "emp", "rights": "add", "urlname": "/add" } },
      { path: 'details/:id', component: AddEmployeeComponent, canActivate: [AuthGuard], data: { "module": "pentt", "submodule": "emp", "rights": "edit", "urlname": "/edit" } },
      { path: 'edit/:id', component: AddEmployeeComponent, canActivate: [AuthGuard], data: { "module": "pentt", "submodule": "emp", "rights": "edit", "urlname": "/edit" } }
    ]
  },
];

@NgModule({
  declarations: [
    AddEmployeeComponent,
    ViewEmployeeComponent
  ],

  imports: [
    CommonModule, FormsModule, RouterModule.forChild(routes), DataTableModule, AutoCompleteModule, FileUploadModule
  ],

  providers: [AuthGuard, EmployeeService]
})

export class EmployeeModule {
  public static routes = routes;
}
