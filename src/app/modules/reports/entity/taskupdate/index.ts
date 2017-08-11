import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedComponentModule } from '@services';
import { AuthGuard } from '@services';

import { TaskUpdateComponent } from './rptut.comp';
import { TaskNatureService } from '@services/master';

import { LazyLoadEvent, DataTableModule, AutoCompleteModule, FileUploadModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: TaskUpdateComponent, canActivate: [AuthGuard],
        data: { "module": "rpt", "submodule": "rptut", "rights": "view", "urlname": "/taskupdate" }
      },
    ]
  },
];

@NgModule({
  declarations: [
    TaskUpdateComponent
  ],

  imports: [
    CommonModule, FormsModule, RouterModule.forChild(routes), DataTableModule, AutoCompleteModule,
    FileUploadModule, SharedComponentModule
  ],

  providers: [AuthGuard, TaskNatureService]
})

export class TaskUpdateReportsModule {
  public static routes = routes;
}
