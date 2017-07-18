import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '../../../_services/authguard-service';

import { AddStatusComponent } from './aded/addstatus.comp';
import { ViewStatusComponent } from './view/viewstatus.comp';

import { CommonService } from '@services';

import { LazyLoadEvent, DataTableModule, AutoCompleteModule, FileUploadModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      { path: '', component: ViewStatusComponent, canActivate: [AuthGuard], data: { "module": "pentt", "submodule": "status", "rights": "view", "urlname": "/Status" } },
      { path: 'add', component: AddStatusComponent, canActivate: [AuthGuard], data: { "module": "pentt", "submodule": "status", "rights": "add", "urlname": "/add" } },
      { path: 'details/:id', component: AddStatusComponent, canActivate: [AuthGuard], data: { "module": "pentt", "submodule": "status", "rights": "edit", "urlname": "/edit" } },
      { path: 'edit/:id', component: AddStatusComponent, canActivate: [AuthGuard], data: { "module": "pentt", "submodule": "status", "rights": "edit", "urlname": "/edit" } }
    ]
  },
];

@NgModule({
  declarations: [
    AddStatusComponent,
    ViewStatusComponent
  ],

  imports: [
    CommonModule, FormsModule, RouterModule.forChild(routes), DataTableModule, AutoCompleteModule, FileUploadModule
  ],

  providers: [AuthGuard, CommonService]
})

export class StatusModule {
  public static routes = routes;
}
