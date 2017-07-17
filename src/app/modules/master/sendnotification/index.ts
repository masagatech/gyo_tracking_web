import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '../../../_services/authguard-service';

import { AddNotificationComponent } from './aded/addntf.comp';
import { ViewNotificationComponent } from './view/viewntf.comp';

import { TeamEmployeeMapService, NotificationService } from '@services/master';

import { LazyLoadEvent, DataTableModule, AutoCompleteModule, FileUploadModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: AddNotificationComponent, canActivate: [AuthGuard],
        data: { "module": "pentt", "submodule": "ntf", "rights": "view", "urlname": "/sendnotification" }
      }
    ]
  },
];

@NgModule({
  declarations: [
    AddNotificationComponent,
    ViewNotificationComponent
  ],

  imports: [
    CommonModule, FormsModule, RouterModule.forChild(routes), DataTableModule, AutoCompleteModule, FileUploadModule
  ],

  providers: [AuthGuard, TeamEmployeeMapService, NotificationService]
})

export class SendNotificationModule {
  public static routes = routes;
}
