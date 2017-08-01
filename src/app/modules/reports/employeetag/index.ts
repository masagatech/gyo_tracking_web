import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedComponentModule } from '../../../_shared/sharedcomp.module';
import { AuthGuard } from '../../../_services/authguard-service';

import { EmployeeTagReportsComponent } from './rptemptag.comp';
import { TagService } from '@services/master';

import { LazyLoadEvent, DataTableModule, AutoCompleteModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: EmployeeTagReportsComponent, canActivate: [AuthGuard],
        data: { "module": "rpt", "submodule": "rtpemptag", "rights": "view", "urlname": "/employeetag" }
      }
    ]
  },
];

@NgModule({
  declarations: [
    EmployeeTagReportsComponent
  ],

  imports: [
    CommonModule, FormsModule, SharedComponentModule, RouterModule.forChild(routes), DataTableModule, AutoCompleteModule
  ],

  providers: [AuthGuard, TagService]
})

export class EmployeeTagReportsModule {
  public static routes = routes;
}
