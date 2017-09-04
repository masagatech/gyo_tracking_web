import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '@services';

import { DailyAttendanceComponent } from './rptdailyatt.comp';
import { EmployeeService } from '@services/master';

import { LazyLoadEvent, DataTableModule, AutoCompleteModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: DailyAttendanceComponent, canActivate: [AuthGuard],
        data: { "module": "rpt", "submodule": "rptdailyatt", "rights": "view", "urlname": "/dailyattendance" }
      }
    ]
  },
];

@NgModule({
  declarations: [
    DailyAttendanceComponent
  ],

  imports: [
    CommonModule, FormsModule, RouterModule.forChild(routes), DataTableModule, AutoCompleteModule
  ],

  providers: [AuthGuard, EmployeeService]
})

export class DailyAttendanceModule {
  public static routes = routes;
}
