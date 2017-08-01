import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '../../../_services/authguard-service';

import { AddPushTagComponent } from './aded/addpt.comp';
import { ViewPushTagComponent } from './view/viewpt.comp';

import { TeamEmployeeMapService, TagService } from '@services/master';

import { LazyLoadEvent, DataTableModule, AutoCompleteModule, FileUploadModule, RadioButtonModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      { path: '', component: ViewPushTagComponent, canActivate: [AuthGuard], data: { "module": "pentt", "submodule": "ptag", "rights": "view", "urlname": "/pushtag" } },
      { path: 'add', component: AddPushTagComponent, canActivate: [AuthGuard], data: { "module": "pentt", "submodule": "ptag", "rights": "add", "urlname": "/add" } },
      { path: 'details/:id', component: AddPushTagComponent, canActivate: [AuthGuard], data: { "module": "pentt", "submodule": "ptag", "rights": "edit", "urlname": "/edit" } },
      { path: 'edit/:id', component: AddPushTagComponent, canActivate: [AuthGuard], data: { "module": "pentt", "submodule": "ptag", "rights": "edit", "urlname": "/edit" } }
    ]
  },
];

@NgModule({
  declarations: [
    AddPushTagComponent,
    ViewPushTagComponent
  ],

  imports: [
    CommonModule, FormsModule, RouterModule.forChild(routes), DataTableModule, AutoCompleteModule, FileUploadModule, RadioButtonModule
  ],

  providers: [AuthGuard, TeamEmployeeMapService, TagService]
})

export class TagPushModule {
  public static routes = routes;
}
