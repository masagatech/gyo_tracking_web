import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedComponentModule } from '@services';
import { AuthGuard } from '@services';

import { TripReportsComponent } from './rpttrp.comp';
import { TripReportsService } from '@services/master';

import { LazyLoadEvent, DataTableModule, AutoCompleteModule, GMapModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: TripReportsComponent, canActivate: [AuthGuard],
        data: { "module": "rpt", "submodule": "rpttrp", "rights": "view", "urlname": "/employeetrips" }
      }
    ]
  },
];

@NgModule({
  declarations: [
    TripReportsComponent
  ],

  imports: [
    CommonModule, FormsModule, SharedComponentModule, RouterModule.forChild(routes), DataTableModule, AutoCompleteModule, GMapModule
  ],

  providers: [AuthGuard, TripReportsService]
})

export class TripReportsModule {
  public static routes = routes;
}
