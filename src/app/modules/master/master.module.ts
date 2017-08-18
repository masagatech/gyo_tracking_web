import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MasterComponent } from '../master/master.comp';
import { AuthGuard } from '@services';

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
                    { path: 'employee', loadChildren: './employee#EmployeeModule' },
                    { path: 'team', loadChildren: './team#TeamModule' },
                    { path: 'tag', loadChildren: './tag#TagModule' },
                    { path: 'teamemployeemap', loadChildren: './teamempmap#TeamEmployeeMapModule' },
                    { path: 'teamownershipmap', loadChildren: './teamownermap#TeamOwnershipMapModule' },
                    { path: 'tagempmap', loadChildren: './tagempmap#TagEmployeeMapModule' },
                    { path: 'employeeleave', loadChildren: './employeeleave#EmployeeLeaveModule' },
                    
                    { path: 'vehicle', loadChildren: './vehicle#VehicleModule' },
                    { path: 'holiday', loadChildren: './holiday#HolidayModule' },
                    { path: 'status', loadChildren: './status#StatusModule' },
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
