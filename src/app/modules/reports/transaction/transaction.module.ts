import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TransactionComponent } from '../transaction/transaction.comp';
import { AuthGuard } from '@services';
import { SharedComponentModule } from '@services';

import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

export const routes = [
    {
        path: '',
        component: TransactionComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: '',
                children: [
                    { path: 'taskallocate', loadChildren: './taskallocate#TaskAllocateReportsModule' },
                    { path: 'expense', loadChildren: './expense#ExpenseReportsModule' },
                    { path: 'trips', loadChildren: './trips#TripReportsModule' },
                    { path: 'stops', loadChildren: './stops#StopsReportsModule' },
                    { path: 'notification', loadChildren: './notification#NotificationReportsModule' },
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
        TransactionComponent
    ],
    providers: [AuthGuard]
})

export class TransactionReportsModule {

}
