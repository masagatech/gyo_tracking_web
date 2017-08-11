import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EntityComponent } from '../employee/employee.comp';
import { AuthGuard } from '@services';
import { SharedComponentModule } from '@services';

import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

export const routes = [
    {
        path: '',
        component: EntityComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: '',
                children: [
                    { path: '', loadChildren: './employee#EmployeeReportsModule' },
                    { path: 'tag', loadChildren: './employeetag#EmployeeTagReportsModule' },
                    { path: 'trips', loadChildren: './employeetrips#EmployeeTripReportsModule' },
                    { path: 'teamwise', loadChildren: './teamwiseemployee#TeamWiseEmployeeModule' },
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
        EntityComponent
    ],
    providers: [AuthGuard]
})

export class EmployeeModule {

}
