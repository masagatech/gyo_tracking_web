import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedComponentModule } from '@services';
import { AuthGuard } from '@services';

import { TeamWiseEmployeeComponent } from './tmwiseemp.comp';
import { EmployeeService } from '@services/master';

import { LazyLoadEvent, DataTableModule, AutoCompleteModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: TeamWiseEmployeeComponent, canActivate: [AuthGuard],
        data: { "module": "rpt", "submodule": "rpttmwiseemp", "rights": "view", "urlname": "/teamwiseemployee" }
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

  providers: [AuthGuard, EmployeeService]
})

export class TeamWiseEmployeeModule {
  public static routes = routes;
}
