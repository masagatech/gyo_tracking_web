import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AttendanceComponent } from '../attendance/attendance.comp';
import { AuthGuard } from '@services';
import { SharedComponentModule } from '@services';

import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

export const routes = [
    {
        path: '',
        component: AttendanceComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: '',
                children: [
                    { path: 'employeeattendance', loadChildren: './employeeattendance#EmployeeAttendanceReportsModule' },
                    { path: 'dailyattendance', loadChildren: './dailyattendance#DailyAttendanceReportsModule' },
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
        AttendanceComponent
    ],
    providers: [AuthGuard]
})

export class AttendanceModule {

}
