import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '../../../_services/authguard-service';

import { TripReportsComponent } from './rpttrips.comp';
import { ReportsService } from '@services/master';

import { LazyLoadEvent, DataTableModule, AutoCompleteModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: TripReportsComponent, canActivate: [AuthGuard],
        data: { "module": "rpt", "submodule": "rptattnatt", "rights": "view", "urlname": "/attendantattendance" }
      }
    ]
  },
];

@NgModule({
  declarations: [
    TripReportsComponent
  ],

  imports: [
    CommonModule, FormsModule, RouterModule.forChild(routes), DataTableModule, AutoCompleteModule
  ],

  providers: [AuthGuard, ReportsService]
})

export class TripReportsModule {
  public static routes = routes;
}
