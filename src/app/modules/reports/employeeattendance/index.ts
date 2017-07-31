import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '../../../_services/authguard-service';

import { EmployeeAttendanceReportsComponent } from './rptempatt.comp';
import { ReportsService } from '@services/master';

import { LazyLoadEvent, DataTableModule, AutoCompleteModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: EmployeeAttendanceReportsComponent, canActivate: [AuthGuard],
        data: { "module": "rpt", "submodule": "empatt", "rights": "view", "urlname": "/employeeattendance" }
      }
    ]
  },
];

@NgModule({
  declarations: [
    EmployeeAttendanceReportsComponent
  ],

  imports: [
    CommonModule, FormsModule, RouterModule.forChild(routes), DataTableModule, AutoCompleteModule
  ],

  providers: [AuthGuard, ReportsService]
})

export class PassengerAttendanceReportsModule {
  public static routes = routes;
}
