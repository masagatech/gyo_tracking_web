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
                    { path: 'vehicle', loadChildren: './vehicle#VehicleModule' },
                    { path: 'status', loadChildren: './status#StatusModule' },

                    { path: 'tag', loadChildren: './tag#TagModule' },
                    { path: 'pushtag', loadChildren: './tagpush#TagPushModule' },

                    { path: 'team', loadChildren: './team#TeamModule' },
                    { path: 'employee', loadChildren: './employee#EmployeeModule' },
                    { path: 'leaveemployee', loadChildren: './employeeleave#LeaveEmployeeModule' },
                    { path: 'teamemployeemap', loadChildren: './teamempmap#TeamEmployeeMapModule' },
                    { path: 'teamownershipmap', loadChildren: './teamownermap#TeamOwnershipMapModule' },
                    { path: 'expenseemployeemap', loadChildren: './expempmap#ExpenseEmployeeMapModule' },
                    
                    { path: 'taskallocate', loadChildren: './taskallocate#TaskAllocateModule' },
                    { path: 'notification', loadChildren: './notification#NotificationModule' },
                    { path: 'expense', loadChildren: './expense#ExpenseModule' },
                    { path: 'voucher', loadChildren: './voucher#VoucherModule' },
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
