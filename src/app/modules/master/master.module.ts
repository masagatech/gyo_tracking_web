import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MasterComponent } from '../master/master.comp';
import { AuthGuard } from '../../_services/authguard-service';

import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

export const routes = [
    {
        path: '',
        component: MasterComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: '',
                children: [
                    { path: 'entity', loadChildren: './entity#EntityModule' },
                    { path: 'vehicle', loadChildren: './vehicle#VehicleModule' },
                    { path: 'holiday', loadChildren: './holiday#HolidayModule' },
                    { path: 'user', loadChildren: './users#UserModule' },
                    { path: 'location', loadChildren: './location#LocationModule' },

                    { path: 'team', loadChildren: './team#TeamModule' },
                    { path: 'employee', loadChildren: './employee#EmployeeModule' },
                    { path: 'teamemployeemap', loadChildren: './teamemployeemap#TeamEmployeeMapModule' },
                    { path: 'teamownershipmap', loadChildren: './teamownermap#TeamOwnershipMapModule' },
                    
                    { path: 'allocatetask', loadChildren: './allocatetask#AllocateTaskModule' },
                    { path: 'sendnotification', loadChildren: './sendnotification#SendNotificationModule' },
                ]
            }
        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes),
        FormsModule,
        CommonModule,
    ],
    declarations: [
        MasterComponent
    ],
    providers: [AuthGuard]
})

export class MasterModule {

}
