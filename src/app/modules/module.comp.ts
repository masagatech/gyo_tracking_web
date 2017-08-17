import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { LoginService } from '@services';
import { LoginUserModel, Globals } from '@models';

@Component({
    templateUrl: 'module.comp.html'
})

export class ModuleComponent implements OnDestroy {
    loginUser: LoginUserModel;
    _wsdetails: any = [];
    _enttdetails: any = [];

    wsname: string = "";
    wslogo: string = "";
    enttname: string = "";

    global = new Globals();

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

        if (Cookie.get("_enttdetails_") == null && Cookie.get("_enttdetails_") == undefined) {
            this._router.navigate(['/workspace/entity']);
        }

        this.getHeaderDetails();
    }

    public ngOnInit() {

    }

    getHeaderDetails() {
        if (Cookie.get('_enttdetails_') != null) {
            this.wsname = this._enttdetails.enttname;
            this.wslogo = this.global.uploadurl + this._enttdetails.schlogo;
            this.enttname = this._wsdetails.wsname;
        }
        else {
            this.wsname = this.loginUser.enttname;
            this.wslogo = this.global.uploadurl + this.loginUser.schlogo;
            this.enttname = this.loginUser.wsname;
        }
    }

    ngOnDestroy() {

    }
}