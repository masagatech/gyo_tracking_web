import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedComponentModule } from '@services';
import { AuthGuard } from '@services';

import { WorkspaceReportsComponent } from './rptwrksp.comp';
import { WorkspaceService } from '@services/master';

import { LazyLoadEvent, DataTableModule, AutoCompleteModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: WorkspaceReportsComponent, canActivate: [AuthGuard],
        data: { "module": "rpt", "submodule": "rptws", "rights": "view", "urlname": "/workspace" }
      }
    ]
  },
];

@NgModule({
  declarations: [
    WorkspaceReportsComponent
  ],

  imports: [
    CommonModule, FormsModule, SharedComponentModule, RouterModule.forChild(routes), DataTableModule, AutoCompleteModule
  ],

  providers: [AuthGuard, WorkspaceService]
})

export class WorkspaceReportsModule {
  public static routes = routes;
}
