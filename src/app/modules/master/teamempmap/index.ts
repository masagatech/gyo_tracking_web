import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard, SharedComponentModule } from '@services';

import { AddTeamEmployeeMapComponent } from './addtem.comp';
import { TeamEmployeeMapService } from '@services/master';

import { LazyLoadEvent, DataTableModule, AutoCompleteModule, FileUploadModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: AddTeamEmployeeMapComponent, canActivate: [AuthGuard],
        data: { "module": "pentt", "submodule": "tmemp", "rights": "view", "urlname": "/teamemployeepmap" }
      }
    ]
  },
];

@NgModule({
  declarations: [
    AddTeamEmployeeMapComponent
  ],

  imports: [
    CommonModule, FormsModule, RouterModule.forChild(routes), SharedComponentModule, DataTableModule, AutoCompleteModule, FileUploadModule
  ],

  providers: [AuthGuard, TeamEmployeeMapService]
})

export class TeamEmployeeMapModule {
  public static routes = routes;
}
