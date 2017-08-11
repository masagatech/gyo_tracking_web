import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '@services';

import { EmployeeAttendancesComponent } from './rptempatt.comp';
import { ReportsService } from '@services/master';

import { LazyLoadEvent, DataTableModule, AutoCompleteModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: EmployeeAttendancesComponent, canActivate: [AuthGuard],
        data: { "module": "rpt", "submodule": "empatt", "rights": "view", "urlname": "/employeeattendance" }
      }
    ]
  },
];

@NgModule({
  declarations: [
    EmployeeAttendancesComponent
  ],

  imports: [
    CommonModule, FormsModule, RouterModule.forChild(routes), DataTableModule, AutoCompleteModule
  ],

  providers: [AuthGuard, ReportsService]
})

export class EmployeeAttendanceModule {
  public static routes = routes;
}
