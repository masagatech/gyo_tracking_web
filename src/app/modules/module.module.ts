import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ModuleComponent } from '../modules/module.comp';
import { SharedComponentModule } from '@services';
import { AuthGuard } from '@services';

import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

export const routes = [
    {
        path: '',
        component: ModuleComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: '',
                children: [
                    { path: '', loadChildren: './dashboard#DashboardModule' },

                    // Trip Tracking
                    { path: 'triptracking', loadChildren: './triptracking#TripTrackingModule' },

                    // Master
                    { path: 'master', loadChildren: './master#MasterModule' },

                    // Transaction
                    { path: 'transaction', loadChildren: './transaction#TransactionModule' },

                    // Reports
                    { path: 'reports', loadChildren: './reports#ReportsModule' },

                    // Setting
                    { path: 'settings', loadChildren: './settings#SettingsModule' },
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
        ModuleComponent,
        // NoPageComponent,
    ],
    providers: [AuthGuard]
})

export class ModuleModule {

}
