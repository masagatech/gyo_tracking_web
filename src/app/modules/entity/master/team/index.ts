import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '@services';

import { AddTeamComponent } from './aded/addtm.comp';
import { ViewTeamComponent } from './view/viewtm.comp';

import { TeamService } from '@services/master';

import { LazyLoadEvent, DataTableModule, AutoCompleteModule, FileUploadModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      { path: '', component: ViewTeamComponent, canActivate: [AuthGuard], data: { "module": "pentt", "submodule": "tm", "rights": "view", "urlname": "/team" } },
      { path: 'add', component: AddTeamComponent, canActivate: [AuthGuard], data: { "module": "pentt", "submodule": "tm", "rights": "add", "urlname": "/add" } },
      { path: 'details/:id', component: AddTeamComponent, canActivate: [AuthGuard], data: { "module": "pentt", "submodule": "tm", "rights": "edit", "urlname": "/edit" } },
      { path: 'edit/:id', component: AddTeamComponent, canActivate: [AuthGuard], data: { "module": "pentt", "submodule": "tm", "rights": "edit", "urlname": "/edit" } }
    ]
  },
];

@NgModule({
  declarations: [
    AddTeamComponent,
    ViewTeamComponent
  ],

  imports: [
    CommonModule, FormsModule, RouterModule.forChild(routes), DataTableModule, AutoCompleteModule, FileUploadModule
  ],

  providers: [AuthGuard, TeamService]
})

export class TeamModule {
  public static routes = routes;
}
