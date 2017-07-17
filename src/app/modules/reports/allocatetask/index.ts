import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '../../../_services/authguard-service';

import { AllocateTaskComponent } from './rptat.comp';

import { GroupService } from '@services/master';

import { LazyLoadEvent, DataTableModule, AutoCompleteModule, FileUploadModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: AllocateTaskComponent, canActivate: [AuthGuard],
        data: { "module": "rpt", "submodule": "at", "rights": "view", "urlname": "/allocatetask" }
      },
    ]
  },
];

@NgModule({
  declarations: [
    AllocateTaskComponent
  ],

  imports: [
    CommonModule, FormsModule, RouterModule.forChild(routes), DataTableModule, AutoCompleteModule, FileUploadModule
  ],

  providers: [AuthGuard, GroupService]
})

export class AllocateTaskReportsModule {
  public static routes = routes;
}
