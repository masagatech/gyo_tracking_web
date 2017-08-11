import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedComponentModule } from '@services';
import { AuthGuard } from '@services';

import { EmployeeReportsComponent } from './rptemp.comp';
import { EmployeeService } from '@services/master';

import { LazyLoadEvent, DataTableModule, AutoCompleteModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: EmployeeReportsComponent, canActivate: [AuthGuard],
        data: { "module": "rpt", "submodule": "rptemp", "rights": "view", "urlname": "/employee" }
      }
    ]
  },
];

@NgModule({
  declarations: [
    EmployeeReportsComponent
  ],

  imports: [
    CommonModule, FormsModule, SharedComponentModule, RouterModule.forChild(routes), DataTableModule, AutoCompleteModule
  ],

  providers: [AuthGuard, EmployeeService]
})

export class EmployeeReportsModule {
  public static routes = routes;
}
