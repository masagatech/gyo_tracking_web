import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { LoginService } from '@services';
import { LoginUserModel, Globals } from '@models';

@Component({
    templateUrl: 'settings.comp.html'
})

export class SettingsComponent implements OnDestroy {
    loginUser: LoginUserModel;
    _wsdetails: any = [];
    _enttdetails: any = [];

    global = new Globals();

    wsname: string = "";
    wslogo: string = "";
    enttname: string = "";

    constructor(private _router: Router, private _loginservice: LoginService) {
        this.loginUser = this._loginservice.getUser();
        this._wsdetails = Globals.getWSDetails();
        this._enttdetails = Globals.getEntityDetails();

        if (Cookie.get('_session_') == null && Cookie.get('_session_') == undefined) {
            this._router.navigate(['/login']);
        }

        if (Cookie.get("_wsdetails_") == null && Cookie.get("_wsdetails_") == undefined) {
            this._router.navigate(['/admin/workspace']);
        }

        this.getHeaderDetails();
    }

    public ngOnInit() {

    }

    getHeaderDetails() {
        if (Cookie.get('_wsdetails_') != null) {
            this.wsname = this._wsdetails.wsname;
            this.wslogo = this.global.uploadurl + this._wsdetails.wslogo;
            this.enttname = Cookie.get('_enttdetails_') != null ? this._enttdetails.enttname : "";
        }
    }

    ngOnDestroy() {

    }
}