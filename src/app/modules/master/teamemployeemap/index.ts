import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '../../../_services/authguard-service';

import { TeamEmployeeMapComponent } from './tmempmap.comp';
import { EmpGroupMapService } from '@services/master';

import { LazyLoadEvent, DataTableModule, AutoCompleteModule, FileUploadModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: TeamEmployeeMapComponent, canActivate: [AuthGuard],
        data: { "module": "pentt", "submodule": "egm", "rights": "view", "urlname": "/teamemployeepmap" }
      }
    ]
  },
];

@NgModule({
  declarations: [
    TeamEmployeeMapComponent
  ],

  imports: [
    CommonModule, FormsModule, RouterModule.forChild(routes), DataTableModule, AutoCompleteModule, FileUploadModule
  ],

  providers: [AuthGuard, EmpGroupMapService]
})

export class EmployeeGroupMapModule {
  public static routes = routes;
}
