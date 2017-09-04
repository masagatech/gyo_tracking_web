import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EmployeeComponent } from '../employee/employee.comp';
import { AuthGuard } from '@services';
import { SharedComponentModule } from '@services';

import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

export const routes = [
    {
        path: '',
        component: EmployeeComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: '',
                children: [
                    { path: 'monthlyattendance', loadChildren: './monthlyattendance#MonthlyAttendanceModule' },
                    { path: 'dailyattendance', loadChildren: './dailyattendance#DailyAttendanceModule' },
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
        EmployeeComponent
    ],
    providers: [AuthGuard]
})

export class EmployeeReportsModule {

}
