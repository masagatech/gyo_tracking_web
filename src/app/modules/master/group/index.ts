import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '../../../_services/authguard-service';

import { AddGroupComponent } from './aded/addgrp.comp';
import { ViewGroupComponent } from './view/viewgrp.comp';

import { GroupService } from '@services/master';

import { LazyLoadEvent, DataTableModule, AutoCompleteModule, FileUploadModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      { path: '', component: ViewGroupComponent, canActivate: [AuthGuard], data: { "module": "pentt", "submodule": "grp", "rights": "view", "urlname": "/group" } },
      { path: 'add', component: AddGroupComponent, canActivate: [AuthGuard], data: { "module": "pentt", "submodule": "grp", "rights": "add", "urlname": "/add" } },
      { path: 'details/:id', component: AddGroupComponent, canActivate: [AuthGuard], data: { "module": "pentt", "submodule": "grp", "rights": "edit", "urlname": "/edit" } },
      { path: 'edit/:id', component: AddGroupComponent, canActivate: [AuthGuard], data: { "module": "pentt", "submodule": "grp", "rights": "edit", "urlname": "/edit" } }
    ]
  },
];

@NgModule({
  declarations: [
    AddGroupComponent,
    ViewGroupComponent
  ],

  imports: [
    CommonModule, FormsModule, RouterModule.forChild(routes), DataTableModule, AutoCompleteModule, FileUploadModule
  ],

  providers: [AuthGuard, GroupService]
})

export class GroupModule {
  public static routes = routes;
}
