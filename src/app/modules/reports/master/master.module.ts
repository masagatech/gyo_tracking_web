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
                    { path: 'vehicle', loadChildren: './vehicle#VehicleReportsModule' },
                    { path: 'stops', loadChildren: './stops#StopsReportsModule' },
                    { path: 'expense', loadChildren: './expense#ExpenseReportsModule' },

                    { path: 'taskallocate', loadChildren: './taskallocate#TaskAllocateReportsModule' },
                    { path: 'taskupdate', loadChildren: './taskupdate#TaskUpdateReportsModule' },
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

export class MasterModule {

}
