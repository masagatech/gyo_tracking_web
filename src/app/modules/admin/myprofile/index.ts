import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard, SharedComponentModule } from '@services';

import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { MyProfileComponent } from './myprofile.comp';
import { UserService } from '@services/master';

import { DataGridModule, PanelModule } from 'primeng/primeng';

export const routes = [
    {
        path: '',
        component: MyProfileComponent,
        canActivate: [AuthGuard],
        children: [
            { path: '', component: MyProfileComponent, canActivate: [AuthGuard] },
        ]
    },
];

@NgModule({
    declarations: [
        MyProfileComponent
    ],

    imports: [
        RouterModule.forChild(routes), SharedComponentModule, FormsModule, CommonModule, DataGridModule, PanelModule
    ],

    providers: [AuthGuard, UserService]
})

export class MyProfileModule {

}
