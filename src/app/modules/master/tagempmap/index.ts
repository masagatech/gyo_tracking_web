import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '@services';

import { AddTagEmployeeMapComponent } from './aded/addtem.comp';
import { ViewTagEmployeeMapComponent } from './view/viewtem.comp';

import { TeamEmployeeMapService, TagService } from '@services/master';

import { LazyLoadEvent, DataTableModule, AutoCompleteModule, FileUploadModule, RadioButtonModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      { path: '', component: ViewTagEmployeeMapComponent, canActivate: [AuthGuard], data: { "module": "pentt", "submodule": "tagemp", "rights": "view", "urlname": "/tagempmap" } },
      { path: 'add', component: AddTagEmployeeMapComponent, canActivate: [AuthGuard], data: { "module": "pentt", "submodule": "tagemp", "rights": "add", "urlname": "/add" } },
      { path: 'details/:id', component: AddTagEmployeeMapComponent, canActivate: [AuthGuard], data: { "module": "pentt", "submodule": "tagemp", "rights": "edit", "urlname": "/edit" } },
      { path: 'edit/:id', component: AddTagEmployeeMapComponent, canActivate: [AuthGuard], data: { "module": "pentt", "submodule": "tagemp", "rights": "edit", "urlname": "/edit" } }
    ]
  },
];

@NgModule({
  declarations: [
    AddTagEmployeeMapComponent,
    ViewTagEmployeeMapComponent
  ],

  imports: [
    CommonModule, FormsModule, RouterModule.forChild(routes), DataTableModule, AutoCompleteModule, FileUploadModule, RadioButtonModule
  ],

  providers: [AuthGuard, TeamEmployeeMapService, TagService]
})

export class TagEmployeeMapModule {
  public static routes = routes;
}
