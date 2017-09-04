import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedComponentModule } from '@services';
import { AuthGuard } from '@services';

import { AddExpenseEmployeeMapComponent } from './addeem.comp';

import { UserService } from '@services/master';

import { LazyLoadEvent, DataTableModule, CheckboxModule, AutoCompleteModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: AddExpenseEmployeeMapComponent, canActivate: [AuthGuard],
        data: { "module": "set", "submodule": "eem", "rights": "view", "urlname": "/expenseemployeemap" }
      },
    ]
  },
];

@NgModule({
  declarations: [
    AddExpenseEmployeeMapComponent
  ],

  imports: [
    CommonModule, FormsModule, SharedComponentModule, RouterModule.forChild(routes), DataTableModule,
    CheckboxModule, AutoCompleteModule
  ],

  providers: [AuthGuard, UserService]
})

export class ExpenseEmployeeMapModule {
  public static routes = routes;
}
