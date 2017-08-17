import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard, SharedComponentModule } from '@services';

import { EmployeeLeaveReportsComponent } from './rptemplv.comp';

import { EmployeeLeaveService } from '@services/master';

import { LazyLoadEvent, DataTableModule, AutoCompleteModule, FileUploadModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: EmployeeLeaveReportsComponent, canActivate: [AuthGuard],
        data: { "module": "rpt", "submodule": "rptemplv", "rights": "view", "urlname": "/leave" }
      },
    ]
  },
];

@NgModule({
  declarations: [
    EmployeeLeaveReportsComponent
  ],

  imports: [
    CommonModule, FormsModule, RouterModule.forChild(routes), SharedComponentModule, DataTableModule, AutoCompleteModule, FileUploadModule
  ],

  providers: [AuthGuard, EmployeeLeaveService]
})

export class LeaveReportsModule {
  public static routes = routes;
}
