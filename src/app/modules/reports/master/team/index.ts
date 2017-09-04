import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedComponentModule } from '@services';
import { AuthGuard } from '@services';

import { TeamReportsComponent } from './rpttm.comp';
import { TeamService } from '@services/master';

import { LazyLoadEvent, DataTableModule, AutoCompleteModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: TeamReportsComponent, canActivate: [AuthGuard],
        data: { "module": "rpt", "submodule": "rpttm", "rights": "view", "urlname": "/tm" }
      }
    ]
  },
];

@NgModule({
  declarations: [
    TeamReportsComponent
  ],

  imports: [
    CommonModule, FormsModule, SharedComponentModule, RouterModule.forChild(routes), DataTableModule, AutoCompleteModule
  ],

  providers: [AuthGuard, TeamService]
})

export class TeamReportsModule {
  public static routes = routes;
}
