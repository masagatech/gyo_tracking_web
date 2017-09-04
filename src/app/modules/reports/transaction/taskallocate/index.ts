import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard, SharedComponentModule } from '@services';

import { TaskAllocateComponent } from './rptat.comp';

import { TaskAllocateService } from '@services/master';

import { LazyLoadEvent, DataTableModule, AutoCompleteModule, FileUploadModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: TaskAllocateComponent, canActivate: [AuthGuard],
        data: { "module": "rpt", "submodule": "rpttskal", "rights": "view", "urlname": "/taskallocate" }
      },
    ]
  },
];

@NgModule({
  declarations: [
    TaskAllocateComponent
  ],

  imports: [
    CommonModule, FormsModule, RouterModule.forChild(routes), SharedComponentModule, DataTableModule, AutoCompleteModule, FileUploadModule
  ],

  providers: [AuthGuard, TaskAllocateService]
})

export class TaskAllocateReportsModule {
  public static routes = routes;
}
