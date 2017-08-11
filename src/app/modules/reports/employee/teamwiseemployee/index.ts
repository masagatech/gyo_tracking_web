import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedComponentModule } from '@services';
import { AuthGuard } from '@services';

import { TeamWiseEmployeeComponent } from './tmwiseemp.comp';
import { ReportsService } from '@services/master';

import { LazyLoadEvent, DataTableModule, AutoCompleteModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: TeamWiseEmployeeComponent, canActivate: [AuthGuard],
        data: { "module": "rpt", "submodule": "tmwiseemp", "rights": "view", "urlname": "/teamwiseemployee" }
      }
    ]
  },
];

@NgModule({
  declarations: [
    TeamWiseEmployeeComponent
  ],

  imports: [
    CommonModule, FormsModule, SharedComponentModule, RouterModule.forChild(routes), DataTableModule, AutoCompleteModule
  ],

  providers: [AuthGuard, ReportsService]
})

export class TeamWiseEmployeeModule {
  public static routes = routes;
}
