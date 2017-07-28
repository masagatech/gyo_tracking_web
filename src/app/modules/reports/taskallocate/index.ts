import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '../../../_services/authguard-service';

import { TaskAllocateComponent } from './rptat.comp';

import { TaskAllocateService } from '@services/master';

import { LazyLoadEvent, DataTableModule, AutoCompleteModule, FileUploadModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: TaskAllocateComponent, canActivate: [AuthGuard],
        data: { "module": "rpt", "submodule": "at", "rights": "view", "urlname": "/allocatetask" }
      },
    ]
  },
];

@NgModule({
  declarations: [
    TaskAllocateComponent
  ],

  imports: [
    CommonModule, FormsModule, RouterModule.forChild(routes), DataTableModule, AutoCompleteModule, FileUploadModule
  ],

  providers: [AuthGuard, TaskAllocateService]
})

export class TaskAllocateReportsModule {
  public static routes = routes;
}
