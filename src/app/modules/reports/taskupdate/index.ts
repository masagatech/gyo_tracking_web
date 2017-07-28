import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '../../../_services/authguard-service';

import { TaskUpdateComponent } from './rptut.comp';
import { TaskNatureService } from '@services/master';

import { LazyLoadEvent, DataTableModule, AutoCompleteModule, FileUploadModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: TaskUpdateComponent, canActivate: [AuthGuard],
        data: { "module": "rpt", "submodule": "at", "rights": "view", "urlname": "/allocatetask" }
      },
    ]
  },
];

@NgModule({
  declarations: [
    TaskUpdateComponent
  ],

  imports: [
    CommonModule, FormsModule, RouterModule.forChild(routes), DataTableModule, AutoCompleteModule, FileUploadModule
  ],

  providers: [AuthGuard, TaskNatureService]
})

export class TaskUpdateReportsModule {
  public static routes = routes;
}
