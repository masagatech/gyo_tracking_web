import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '../../../_services/authguard-service';

import { GroupOwnershipComponent } from './onrgrpmap.comp';
import { EmpGroupMapService, OwnershipGroupMapService } from '@services/master';

import { LazyLoadEvent, DataTableModule, AutoCompleteModule, FileUploadModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: GroupOwnershipComponent, canActivate: [AuthGuard],
        data: { "module": "pentt", "submodule": "ogm", "rights": "view", "urlname": "/ownershipgroupmap" }
      }
    ]
  },
];

@NgModule({
  declarations: [
    GroupOwnershipComponent
  ],

  imports: [
    CommonModule, FormsModule, RouterModule.forChild(routes), DataTableModule, AutoCompleteModule, FileUploadModule
  ],

  providers: [AuthGuard, EmpGroupMapService, OwnershipGroupMapService]
})

export class OwnershipGroupMapModule {
  public static routes = routes;
}
