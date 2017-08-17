import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedComponentModule } from '@services';
import { AuthGuard } from '@services';

import { TripReportsComponent } from './rptemptrips.comp';
import { ReportsService } from '@services/master';

import { LazyLoadEvent, DataTableModule, AutoCompleteModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: TripReportsComponent, canActivate: [AuthGuard],
        data: { "module": "rpt", "submodule": "rptemptrp", "rights": "view", "urlname": "/employeetrips" }
      }
    ]
  },
];

@NgModule({
  declarations: [
    TripReportsComponent
  ],

  imports: [
    CommonModule, FormsModule, SharedComponentModule, RouterModule.forChild(routes), DataTableModule, AutoCompleteModule
  ],

  providers: [AuthGuard, ReportsService]
})

export class EmployeeTripReportsModule {
  public static routes = routes;
}
