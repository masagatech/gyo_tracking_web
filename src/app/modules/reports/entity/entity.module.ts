import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EntityComponent } from '../entity/entity.comp';
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
                    { path: 'employee', loadChildren: './employee#EmployeeReportsModule' },
                    { path: 'employeetag', loadChildren: './employeetag#EmployeeTagReportsModule' },
                    { path: 'employeetrips', loadChildren: './employeetrips#EmployeeTripReportsModule' },

                    { path: 'vehicle', loadChildren: './vehicle#VehicleReportsModule' },
                    { path: 'stops', loadChildren: './stops#StopsReportsModule' },
                    { path: 'expense', loadChildren: './expense#ExpenseReportsModule' },

                    { path: 'taskallocate', loadChildren: './taskallocate#TaskAllocateReportsModule' },
                    { path: 'taskupdate', loadChildren: './taskupdate#TaskUpdateReportsModule' },

                    { path: 'teamwiseemployee', loadChildren: './teamwiseemployee#TeamWiseEmployeeModule' },
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

export class MasterModule {

}
