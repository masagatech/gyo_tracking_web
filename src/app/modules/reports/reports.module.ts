import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReportsComponent } from '../reports/reports.comp';
import { AuthGuard } from '@services';
import { SharedComponentModule } from '@services';

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
                    { path: 'workspace', loadChildren: './workspace#WorkspaceModule' },
                    { path: 'master', loadChildren: './master#MasterModule' },
                    { path: 'transaction', loadChildren: './transaction#TransactionModule' },
                    { path: 'log', loadChildren: './log#LogModule' },
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
        ReportsComponent
    ],
    providers: [AuthGuard]
})

export class ReportsModule {

}
