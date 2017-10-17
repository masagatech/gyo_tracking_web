import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedComponentModule } from '@services';
import { AuthGuard } from '@services';

import { StopsReportsComponent } from './rptstops.comp';
import { StopsReportsService } from '@services/master';

import { LazyLoadEvent, DataTableModule, AutoCompleteModule, GMapModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: StopsReportsComponent, canActivate: [AuthGuard],
        data: { "module": "stops", "submodule": "rptstp", "rights": "view", "urlname": "/stops" }
      }
    ]
  },
];

@NgModule({
  declarations: [
    StopsReportsComponent
  ],

  imports: [
    CommonModule, FormsModule, SharedComponentModule, RouterModule.forChild(routes),
    DataTableModule, AutoCompleteModule, GMapModule
  ],

  providers: [AuthGuard, StopsReportsService]
})

export class StopsReportsModule {
  public static routes = routes;
}
