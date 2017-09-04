import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard, SharedComponentModule } from '@services';

import { AddVoucherComponent } from './aded/addvcr.comp';
import { ViewVoucherComponent } from './view/viewvcr.comp';
import { PendingVoucherComponent } from './pending/pendvcr.comp';
import { ApprovalVoucherComponent } from './approval/apprvcr.comp';

import { VoucherService } from '@services/master';

import { LazyLoadEvent, DataTableModule, DataGridModule, AutoCompleteModule, FileUploadModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: ViewVoucherComponent, canActivate: [AuthGuard],
        data: { "module": "pentt", "submodule": "vcr", "rights": "view", "urlname": "/voucher" }
      },
      {
        path: 'add', component: AddVoucherComponent, canActivate: [AuthGuard],
        data: { "module": "pentt", "submodule": "vcr", "rights": "add", "urlname": "/add" }
      },
      {
        path: 'edit/:id', component: AddVoucherComponent, canActivate: [AuthGuard],
        data: { "module": "pentt", "submodule": "vcr", "rights": "edit", "urlname": "/edit" }
      },
      {
        path: 'pending', component: PendingVoucherComponent, canActivate: [AuthGuard],
        data: { "module": "pentt", "submodule": "vcrappr", "rights": "view", "urlname": "/pending" }
      },
      {
        path: 'approval/:empid', component: ApprovalVoucherComponent, canActivate: [AuthGuard],
        data: { "module": "pentt", "submodule": "vcrappr", "rights": "view", "urlname": "/approval" }
      },
    ]
  },
];

@NgModule({
  declarations: [
    AddVoucherComponent,
    ViewVoucherComponent,
    PendingVoucherComponent,
    ApprovalVoucherComponent
  ],

  imports: [
    CommonModule, FormsModule, SharedComponentModule, RouterModule.forChild(routes), DataTableModule, DataGridModule,
    AutoCompleteModule, FileUploadModule
  ],

  providers: [AuthGuard, VoucherService]
})

export class VoucherModule {
  public static routes = routes;
}
