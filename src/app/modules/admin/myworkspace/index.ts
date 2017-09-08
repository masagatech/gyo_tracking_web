import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard, SharedComponentModule } from '@services';

import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { MyWorkspaceComponent } from './myws.comp';

import { WorkspaceService } from '@services/master';

export const routes = [
    {
        path: '',
        component: MyWorkspaceComponent,
        canActivate: [AuthGuard],
        children: [
            { path: '', component: MyWorkspaceComponent, canActivate: [AuthGuard] },
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
        MyWorkspaceComponent
    ],
    providers: [AuthGuard, WorkspaceService]
})

export class MyWorkspaceModule {

}
