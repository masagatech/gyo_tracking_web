import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '@services';

import { MonthlyAttendanceComponent } from './rptmonthlyatt.comp';
import { ReportsService } from '@services/master';

import { LazyLoadEvent, DataTableModule, AutoCompleteModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: MonthlyAttendanceComponent, canActivate: [AuthGuard],
        data: { "module": "rpt", "submodule": "rptmonthlyatt", "rights": "view", "urlname": "/monthlyattendance" }
      }
    ]
  },
];

@NgModule({
  declarations: [
    MonthlyAttendanceComponent
  ],

  imports: [
    CommonModule, FormsModule, RouterModule.forChild(routes), DataTableModule, AutoCompleteModule
  ],

  providers: [AuthGuard, ReportsService]
})

export class MonthlyAttendanceModule {
  public static routes = routes;
}
