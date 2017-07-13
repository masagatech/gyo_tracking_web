import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '../../../_services/authguard-service';

import { EmpGroupMapComponent } from './empgrpmap.comp';
import { EmpGroupMapService } from '@services/master';

import { LazyLoadEvent, DataTableModule, AutoCompleteModule, FileUploadModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: EmpGroupMapComponent, canActivate: [AuthGuard],
        data: { "module": "pentt", "submodule": "egm", "rights": "view", "urlname": "/employeegroupmap" }
      }
    ]
  },
];

@NgModule({
  declarations: [
    EmpGroupMapComponent
  ],

  imports: [
    CommonModule, FormsModule, RouterModule.forChild(routes), DataTableModule, AutoCompleteModule, FileUploadModule
  ],

  providers: [AuthGuard, EmpGroupMapService]
})

export class EmployeeGroupMapModule {
  public static routes = routes;
}
