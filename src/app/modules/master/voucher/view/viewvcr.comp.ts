import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, MenuService, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { VoucherService } from '@services/master';
import { Cookie } from 'ng2-cookies/ng2-cookies';

declare var $: any;
declare var commonfun: any;

@Component({
    templateUrl: 'viewvcr.comp.html',
    providers: [CommonService]
})

export class ViewVoucherComponent implements OnInit {
    loginUser: LoginUserModel;
    _wsdetails: any = [];

    entityDT: any = [];
    enttid: number = 0;
    enttname: any = [];

    voucherDT: any = [];

    private subscribeParameters: any;

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService, private _loginservice: LoginService,
        private _vcrservice: VoucherService, private _autoservice: CommonService) {
        this.loginUser = this._loginservice.getUser();
        this._wsdetails = Globals.getWSDetails();

        this.viewVoucherDataRights();
    }

    public ngOnInit() {

    }

    // Auto Completed Entity

    getEntityData(event) {
        let query = event.query;

        this._autoservice.getAutoData({
            "flag": "entity",
            "uid": this.loginUser.uid,
            "ucode": this.loginUser.ucode,
            "utype": this.loginUser.utype,
            "issysadmin": this.loginUser.issysadmin,
            "wsautoid": this._wsdetails.wsautoid,
            "search": query
        }).subscribe((data) => {
            this.entityDT = data.data;
        }, err => {
            this._msg.Show(messageType.error, "Error", err);
        }, () => {

        });
    }

    // Selected Entity

    selectEntityData(event) {
        this.enttid = event.value;

        Cookie.set("_enttid_", event.value);
        Cookie.set("_enttnm_", event.label);

        this.getVoucherDetails();
    }

    // View Data Rights

    public viewVoucherDataRights() {
        var that = this;

        if (Cookie.get('_enttnm_') != null) {
            that.enttid = parseInt(Cookie.get('_enttid_'));
            that.enttname.value = parseInt(Cookie.get('_enttid_'));
            that.enttname.label = Cookie.get('_enttnm_');

            that.getVoucherDetails();
        }
    }

    getVoucherDetails() {
        var that = this;
        var params = {};

        commonfun.loader();

        params = {
            "flag": "all",
            "enttid": that.enttid,
            "wsautoid": that._wsdetails.wsautoid
        }

        that._vcrservice.getVoucherDetails(params).subscribe(data => {
            try {
                that.voucherDT = data.data;
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

    public addVoucherForm() {
        this._router.navigate(['/master/voucher/add']);
    }

    public editVoucherForm(row) {
        this._router.navigate(['/master/voucher/edit', row.autoid]);
    }
}