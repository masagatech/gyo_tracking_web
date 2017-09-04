import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedComponentModule } from '@services';
import { AuthGuard } from '@services';

import { TagReportsComponent } from './rpttag.comp';
import { TagService } from '@services/master';

import { LazyLoadEvent, DataTableModule, AutoCompleteModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: TagReportsComponent, canActivate: [AuthGuard],
        data: { "module": "rpt", "submodule": "rpttag", "rights": "view", "urlname": "/employeetag" }
      }
    ]
  },
];

@NgModule({
  declarations: [
    TagReportsComponent
  ],

  imports: [
    CommonModule, FormsModule, SharedComponentModule, RouterModule.forChild(routes), DataTableModule, AutoCompleteModule
  ],

  providers: [AuthGuard, TagService]
})

export class TagReportsModule {
  public static routes = routes;
}
