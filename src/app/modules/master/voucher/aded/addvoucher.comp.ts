import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, MenuService, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { VoucherService } from '@services/master';
import { Cookie } from 'ng2-cookies/ng2-cookies';

declare var $: any;
declare var commonfun: any;

@Component({
    templateUrl: 'addvoucher.comp.html',
    providers: [CommonService]
})

export class AddVoucherComponent implements OnInit {
    loginUser: LoginUserModel;

    _wsdetails: any = [];

    entityDT: any = [];
    enttid: number = 0;
    enttname: string = "";

    empid: number = 0;
    empae: string = "";
    expae: any = 0;
    amt:number = 0;
    nodoc: string = "";
    remark: string="";

    private subscribeParameters: any;

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService, private _loginservice: LoginService,
        private _vchservice: VoucherService, private _autoservice: CommonService) {
        this.loginUser = this._loginservice.getUser();
        this._wsdetails = Globals.getWSDetails();
      
    }

    public ngOnInit() {
        setTimeout(function () {
            $(".frmdt").focus();
        }, 100);

        this.getVoucherDetails();
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
        this.enttname = event.label;
    }

    // Clear Fields

    resetVoucherFields() {
        this.empid = 0;
        this.empae = "";
        this.expae = "";
        this.amt = 0;
        this.nodoc = "";
        this.remark ="";
    }

    // Save Data

    saveVoucherInfo() {
        var that = this;

        if (that.enttid == 0) {
            that._msg.Show(messageType.error, "Error", "Enter Entity Name");
            $(".enttname input").focus();
        }
        else if (that.expae == "") {
            that._msg.Show(messageType.error, "Error", "Enter Expense Code");
            $(".expcd").focus();
        }
        else if (that.expae == "") {
            that._msg.Show(messageType.error, "Error", "Enter Expense Name");
            $(".expae").focus();
        }
        else if (that.amt == 0) {
            that._msg.Show(messageType.error, "Error", "Enter Amount");
             $(".amt ").focus();
        }
        else if (that.nodoc == "") {
            that._msg.Show(messageType.error, "Error", "Select Amount Type");
            $(".nodoc ").focus();
        }
        else {
            commonfun.loader();

            var saveVoucher = {
                "empid": that.empid,
                "empae": that.empae,
                "expae": that.expae,
                "amt": that.amt,
                "nodoc": that.nodoc,
                "enttid": that.enttid,
                "cuid": that.loginUser.ucode,
                "wsautoid": that._wsdetails.wsautoid,
                "mode": ""
            }

            that._vchservice.saveVoucherInfo(saveVoucher).subscribe(data => {
                try {
                    var dataResult = data.data[0].funsave_voucherinfo;
                    var msg = dataResult.msg;
                    var msgid = dataResult.msgid;

                    if (msgid != "-1") {
                        that._msg.Show(messageType.success, "Success", msg);

                        if (msgid == "1") {
                            that.resetVoucherFields();
                        }
                        else {
                            that.backViewData();
                        }

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
    }

    // Get Voucher Data

    getVoucherDetails() {
        var that = this;
        var params = {};

        commonfun.loader();

        that.subscribeParameters = that._routeParams.params.subscribe(params => {
            if (params['id'] !== undefined) {
                that.empid = params['id'];

                params = {
                    "flag": "edit",
                    "empid": that.empid,
                    "wsautoid": that._wsdetails.wsautoid
                }

                that._vchservice.getVoucherDetails(params).subscribe(data => {
                    try {
                        that.enttid = data.data[0].enttid;
                        that.enttname = data.data[0].enttname;
                        that.empid = data.data[0].empid;
                        that.empae = data.data[0].empae;
                        that.expae = data.data[0].expae;
                        that.amt = data.data[0].amt;
                        that.nodoc = data.data[0].nodoc;
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
                that.resetVoucherFields();
                commonfun.loaderhide();
            }
        });
    }

    // Back For View Data

    backViewData() {
        this._router.navigate(['/master/voucher']);
    }
}