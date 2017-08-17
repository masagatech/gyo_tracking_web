import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, MenuService, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { VoucherService } from '@services/master';
import { Cookie } from 'ng2-cookies/ng2-cookies';

declare var $: any;
declare var commonfun: any;

@Component({
    templateUrl: 'pendvcr.comp.html',
    providers: [CommonService]
})

export class PendingVoucherComponent implements OnInit {
    loginUser: LoginUserModel;
    _wsdetails: any = [];
    _enttdetails: any = [];

    pendVoucherDT: any = [];

    private subscribeParameters: any;

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService, private _loginservice: LoginService,
        private _vcrservice: VoucherService, private _autoservice: CommonService) {
        this.loginUser = this._loginservice.getUser();
        this._wsdetails = Globals.getWSDetails();
        this._enttdetails = Globals.getEntityDetails();

        this.getVoucherDetails();
    }

    public ngOnInit() {

    }

    // View Data Rights

    getVoucherDetails() {
        var that = this;
        var params = {};

        commonfun.loader();

        params = {
            "flag": "pending", "uid": that.loginUser.uid, "utype": that.loginUser.utype,
            "enttid": that._enttdetails.enttid, "wsautoid": that._wsdetails.wsautoid, "issysadmin": that.loginUser.issysadmin
        }

        that._vcrservice.getVoucherDetails(params).subscribe(data => {
            try {
                that.pendVoucherDT = data.data;
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

    public openApprovalForm(row) {
        this._router.navigate(['/master/voucher/approval/' + row.empid]);
    }
}