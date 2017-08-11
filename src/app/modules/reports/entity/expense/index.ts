import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedComponentModule } from '@services';
import { AuthGuard } from '@services';

import { ExpenseReportsComponent } from './rptexp.comp';
import { ExpenseService } from '@services/master';

import { LazyLoadEvent, DataTableModule, AutoCompleteModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: ExpenseReportsComponent, canActivate: [AuthGuard],
        data: { "module": "rpt", "submodule": "rtpexp", "rights": "view", "urlname": "/expense" }
      }
    ]
  },
];

@NgModule({
  declarations: [
    ExpenseReportsComponent
  ],

  imports: [
    CommonModule, FormsModule, SharedComponentModule, RouterModule.forChild(routes), DataTableModule, AutoCompleteModule
  ],

  providers: [AuthGuard, ExpenseService]
})

export class ExpenseReportsModule {
  public static routes = routes;
}
