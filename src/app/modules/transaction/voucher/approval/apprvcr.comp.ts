import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, MenuService, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { VoucherService } from '@services/master';
import { Cookie } from 'ng2-cookies/ng2-cookies';

declare var $: any;
declare var commonfun: any;

@Component({
    templateUrl: 'apprvcr.comp.html',
    providers: [CommonService]
})

export class ApprovalVoucherComponent implements OnInit, OnDestroy {
    loginUser: LoginUserModel;
    _wsdetails: any = [];
    _enttdetails: any = [];

    empid: number = 0;

    headertitle: string = "";
    voucherNoDT: any = [];
    selectedvcrnorow: any = [];
    pendVoucherDT: any = [];

    private subscribeParameters: any;

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService, private _loginservice: LoginService,
        private _vcrservice: VoucherService, private _autoservice: CommonService) {
        this.loginUser = this._loginservice.getUser();
        this._wsdetails = Globals.getWSDetails();
        this._enttdetails = Globals.getEntityDetails();

        this.getVoucherNo();
    }

    public ngOnInit() {
        setTimeout(function () {
            $(".enttname input").focus();
            commonfun.navistyle();

            $.AdminBSB.islocked = true;
            $.AdminBSB.leftSideBar.Close();
            $.AdminBSB.rightSideBar.activate();
        }, 100);
    }

    // Get Voucher No

    getVoucherNo() {
        var that = this;
        var params = {};

        commonfun.loader();

        that.subscribeParameters = that._routeParams.params.subscribe(params => {
            if (params['empid'] !== undefined) {
                that.empid = params['empid'];

                params = {
                    "flag": "voucherno",
                    "enttid": that._enttdetails.enttid,
                    "empid": that.empid,
                    "wsautoid": that._wsdetails.wsautoid
                }

                that._vcrservice.getVoucherDetails(params).subscribe(data => {
                    try {
                        that.voucherNoDT = data.data;
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
            else {
                commonfun.loaderhide();
            }
        });
    }

    // Get Voucher Data

    getVoucherDetails(row) {
        var that = this;
        var params = {};

        commonfun.loader();

        that.selectedvcrnorow = row;
        that.headertitle = "Voucher No : " + row.expid + " (" + row.countvcr + ")";

        params = {
            "flag": "byemp",
            "expid": row.expid,
            "empid": row.empid,
            "enttid": row.enttid,
            "wsautoid": that._wsdetails.wsautoid
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

    // Save Voucher Approval

    saveVoucherApproval() {
        var that = this;
        var vcrapprdata = [];

        commonfun.loader();

        for (var i = 0; i < that.pendVoucherDT.length; i++) {
            var vcrrow = that.pendVoucherDT[i];

            vcrapprdata.push({
                "vcraid": "0",
                "enttid": that._enttdetails.enttid,
                "empid": that.empid,
                "expid": vcrrow.expid,
                "vcrid": vcrrow.vcrid,
                "vcrtype": vcrrow.vcrtype,
                "appramt": vcrrow.appramt,
                "apprremark": vcrrow.apprremark,
                "cuid": that.loginUser.ucode,
                "wsautoid": that._wsdetails.wsautoid,
                "isactive": true
            })
        }

        that._vcrservice.saveVoucherApproval({ "vcrapprdata": vcrapprdata }).subscribe(data => {
            try {
                var dataResult = data.data[0].funsave_voucherapproval;
                var msg = dataResult.msg;
                var msgid = dataResult.msgid;

                if (msgid != "-1") {
                    that._msg.Show(messageType.success, "Success", msg);
                    that.getVoucherNo();
                    that.getVoucherDetails(that.selectedvcrnorow);

                    commonfun.loaderhide();
                }
                else {
                    that._msg.Show(messageType.error, "Error", msg);
                    commonfun.loaderhide();
                }
            }
            catch (e) {
                that._msg.Show(messageType.error, "Error", e);
            }
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
            console.log(err);
            commonfun.loaderhide();
        }, () => {
        });
    }

    // Back For View Data

    backViewData() {
        this._router.navigate(['/transaction/voucher/pending']);
    }

    public ngOnDestroy() {
        $.AdminBSB.islocked = false;
        $.AdminBSB.leftSideBar.Open();
    }
}