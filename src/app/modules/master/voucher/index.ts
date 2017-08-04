import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedComponentModule } from '../../../_shared/sharedcomp.module';
import { AuthGuard } from '../../../_services/authguard-service';

import { AddVoucherComponent } from './aded/addvoucher.comp';
import { ViewVoucherComponent } from './view/viewvoucher.comp';

import { VoucherService } from '@services/master';

import { LazyLoadEvent, DataTableModule, AutoCompleteModule, FileUploadModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      { path: '', component: ViewVoucherComponent, canActivate: [AuthGuard], data: { "module": "pentt", "submodule": "vcr", "rights": "view", "urlname": "/voucher" } },
      { path: 'add', component: AddVoucherComponent, canActivate: [AuthGuard], data: { "module": "pentt", "submodule": "vcr", "rights": "add", "urlname": "/add" } },
      { path: 'details/:id', component: AddVoucherComponent, canActivate: [AuthGuard], data: { "module": "pentt", "submodule": "vcr", "rights": "edit", "urlname": "/edit" } },
      { path: 'edit/:id', component: AddVoucherComponent, canActivate: [AuthGuard], data: { "module": "pentt", "submodule": "vcr", "rights": "edit", "urlname": "/edit" } }
    ]
  },
];

@NgModule({
  declarations: [
    AddVoucherComponent,
    ViewVoucherComponent
  ],

  imports: [
    CommonModule, FormsModule, SharedComponentModule, RouterModule.forChild(routes), DataTableModule, AutoCompleteModule, FileUploadModule
  ],

  providers: [AuthGuard, VoucherService]
})

export class VoucherModule {
  public static routes = routes;
}
