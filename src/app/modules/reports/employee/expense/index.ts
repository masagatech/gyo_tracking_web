import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard, SharedComponentModule } from '@services';

import { ExpenseReportsComponent } from './rptexp.comp';

import { ExpenseService } from '@services/master';

import { LazyLoadEvent, DataTableModule, AutoCompleteModule, FileUploadModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: ExpenseReportsComponent, canActivate: [AuthGuard],
        data: { "module": "rpt", "submodule": "rptempexp", "rights": "view", "urlname": "/expense" }
      },
    ]
  },
];

@NgModule({
  declarations: [
    ExpenseReportsComponent
  ],

  imports: [
    CommonModule, FormsModule, RouterModule.forChild(routes), SharedComponentModule, DataTableModule, AutoCompleteModule, FileUploadModule
  ],

  providers: [AuthGuard, ExpenseService]
})

export class ExpenseReportsModule {
  public static routes = routes;
}
