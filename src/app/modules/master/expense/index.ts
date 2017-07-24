import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedComponentModule } from '../../../_shared/sharedcomp.module';
import { AuthGuard } from '../../../_services/authguard-service';

import { AddExpenseComponent } from './aded/addexp.comp';
import { ViewExpenseComponent } from './view/viewexp.comp';

import { ExpenseService } from '@services/master';

import { OnlyNumber } from '@directives';

import { LazyLoadEvent, DataTableModule, AutoCompleteModule, FileUploadModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      { path: '', component: ViewExpenseComponent, canActivate: [AuthGuard], data: { "module": "pentt", "submodule": "exp", "rights": "view", "urlname": "/expense" } },
      { path: 'add', component: AddExpenseComponent, canActivate: [AuthGuard], data: { "module": "pentt", "submodule": "exp", "rights": "add", "urlname": "/add" } },
      { path: 'details/:id', component: AddExpenseComponent, canActivate: [AuthGuard], data: { "module": "pentt", "submodule": "exp", "rights": "edit", "urlname": "/edit" } },
      { path: 'edit/:id', component: AddExpenseComponent, canActivate: [AuthGuard], data: { "module": "pentt", "submodule": "exp", "rights": "edit", "urlname": "/edit" } }
    ]
  },
];

@NgModule({
  declarations: [
    AddExpenseComponent,
    ViewExpenseComponent,
    OnlyNumber
  ],

  imports: [
    CommonModule, FormsModule, SharedComponentModule, RouterModule.forChild(routes), DataTableModule, AutoCompleteModule, FileUploadModule
  ],

  providers: [AuthGuard, ExpenseService]
})

export class ExpenseModule {
  public static routes = routes;
}
