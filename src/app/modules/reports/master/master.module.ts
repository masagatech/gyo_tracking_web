import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MasterComponent } from '../master/master.comp';
import { AuthGuard } from '@services';
import { SharedComponentModule } from '@services';

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
                    { path: 'employee', loadChildren: './employee#EmployeeReportsModule' },
                    { path: 'vehicle', loadChildren: './vehicle#VehicleReportsModule' },
                    { path: 'tag', loadChildren: './tag#TagReportsModule' },
                    { path: 'employeeleave', loadChildren: './employeeleave#EmployeeLeaveReportsModule' },
                    { path: 'teamwiseemployee', loadChildren: './teamwiseemployee#TeamWiseEmployeeModule' },
                    { path: 'holiday', loadChildren: './holiday#HolidayReportsModule' },
                ]
            }
        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes),
        SharedComponentModule,
        FormsModule,
        CommonModule,
    ],
    declarations: [
        MasterComponent
    ],
    providers: [AuthGuard]
})

export class MasterReportsModule {

}
