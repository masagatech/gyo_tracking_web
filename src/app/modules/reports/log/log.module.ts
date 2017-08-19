import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LogComponent } from '../log/log.comp';
import { AuthGuard } from '@services';
import { SharedComponentModule } from '@services';

import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

export const routes = [
    {
        path: '',
        component: LogComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: '',
                children: [
                    { path: 'loginlog', loadChildren: './loginlog#LoginLogModule' },
                    { path: 'menulog', loadChildren: './menulog#MenuLogModule' },
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
        LogComponent
    ],
    providers: [AuthGuard]
})

export class LogReportsModule {

}
