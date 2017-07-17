import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '../../../_services/authguard-service';

import { TeamOwnershipComponent } from './tmonrmap.comp';
import { TeamEmployeeMapService, TeamOwnershipMapService } from '@services/master';

import { LazyLoadEvent, DataTableModule, AutoCompleteModule, FileUploadModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: TeamOwnershipComponent, canActivate: [AuthGuard],
        data: { "module": "pentt", "submodule": "ogm", "rights": "view", "urlname": "/teamownershipmap" }
      }
    ]
  },
];

@NgModule({
  declarations: [
    TeamOwnershipComponent
  ],

  imports: [
    CommonModule, FormsModule, RouterModule.forChild(routes), DataTableModule, AutoCompleteModule, FileUploadModule
  ],

  providers: [AuthGuard, TeamEmployeeMapService, TeamOwnershipMapService]
})

export class TeamOwnershipMapModule {
  public static routes = routes;
}
