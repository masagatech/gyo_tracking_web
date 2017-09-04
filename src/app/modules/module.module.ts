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
                    { path: '', loadChildren: './entity#EntityModule' },
                    { path: 'admin', loadChildren: './admin#AdminModule' },
                    { path: 'reports', loadChildren: './reports#ReportsModule' },
                    { path: 'workspace', loadChildren: './workspace#WorkspaceModule' },
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
