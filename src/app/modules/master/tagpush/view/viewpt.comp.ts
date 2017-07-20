import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { PushTagService } from '@services/master';
import { LazyLoadEvent } from 'primeng/primeng';
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Component({
    templateUrl: 'viewpt.comp.html',
    providers: [CommonService]
})

export class ViewPushTagComponent implements OnInit {
    notificationDT: any = [];
    loginUser: LoginUserModel;

    _wsdetails: any = [];

    entityDT: any = [];
    entityid: number = 0;
    entityname: string = "";

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService,
        private _loginservice: LoginService, private _autoservice: CommonService, private _ptservice: PushTagService) {
        this.loginUser = this._loginservice.getUser();
        this._wsdetails = Globals.getWSDetails();

        this.getPushTagDetails();
    }

    public ngOnInit() {

    }

    getPushTagDetails() {
        var that = this;
        commonfun.loader();

        that._ptservice.getPushTagDetails({ "flag": "all", "wsautoid": that._wsdetails.wsautoid }).subscribe(data => {
            try {
                that.notificationDT = data.data;
            }
            catch (e) {
                that._msg.Show(messageType.error, "Error", e);
            }

            commonfun.loaderhide();
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
            console.log(err);
            commonfun.loaderhide();
        }, () => {

        })
    }

    public addPushTag() {
        this._router.navigate(['/master/pushtag/add']);
    }

    public editPushTag(row) {
        this._router.navigate(['/master/pushtag/edit', row.ptid]);
    }
}
