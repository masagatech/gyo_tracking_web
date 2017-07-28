import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReportsComponent } from '../reports/reports.comp';
import { AuthGuard } from '../../_services/authguard-service';

import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

export const routes = [
    {
        path: '',
        component: ReportsComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: '',
                children: [
                    { path: 'passengerattendance', loadChildren: './passengerattendance#PassengerAttendanceReportsModule' },
                    { path: 'dailyattendance', loadChildren: './dailyattendance#DailyAttendanceReportsModule' },
                    { path: 'driverattendance', loadChildren: './driverattendance#DriverAttendanceReportsModule' },
                    { path: 'attendantattendance', loadChildren: './attendentattendance#AttendentAttendanceReportsModule' },
                    { path: 'teamwiseemployee', loadChildren: './teamwiseemployee#TeamWiseEmployeeModule' },
                    { path: 'directpassenger', loadChildren: './directpassenger#DirectPassengerComponent' },
                    { path: 'unschedulepassenger', loadChildren: './unschedulepassenger#UnschedulePassengerModule' },
                    
                    { path: 'speed', loadChildren: './speed#SpeedReportsModule' },

                    { path: 'entity', loadChildren: './entity#EntityReportsModule' },
                    { path: 'users', loadChildren: './users#UserReportsModule' },
                    { path: 'location', loadChildren: './location#LocationReportsModule' },

                    { path: 'employee', loadChildren: './employee#EmployeeReportsModule' },
                    { path: 'vehicle', loadChildren: './vehicle#VehicleReportsModule' },
                    { path: 'holiday', loadChildren: './holiday#HolidayReportsModule' },
                    
                    { path: 'taskallocate', loadChildren: './taskallocate#TaskAllocateReportsModule' },
                    { path: 'taskupdate', loadChildren: './taskupdate#TaskUpdateReportsModule' },

                    { path: 'loginlog', loadChildren: './loginlog#LoginLogReportsModule' },
                    { path: 'workspace', loadChildren: './workspace#WorkspaceReportsModule' },
               
                    { path: 'stops', loadChildren: './stops#StopsReportsModule' }
                   
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
        ReportsComponent
    ],
    providers: [AuthGuard]
})

export class ReportsModule {

}
