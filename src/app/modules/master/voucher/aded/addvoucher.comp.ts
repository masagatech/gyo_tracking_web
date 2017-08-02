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
    enttname: any = [];

    employeeDT: any = [];
    empid: number = 0;
    empname: any = [];

    expenseDT: any = [];
    expid: number = 0;
    expname: any = [];

    amt: number = 0;
    noofdoc: string = "";
    remark: string = "";

    voucherData: any = [];

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
        
        Cookie.set("_enttid_", event.value);
        Cookie.set("_enttnm_", event.label);
    }

    // Auto Completed Employee

    getEmployeeData(event) {
        let query = event.query;

        this._autoservice.getAutoData({
            "flag": "employee",
            "uid": this.loginUser.uid,
            "ucode": this.loginUser.ucode,
            "utype": this.loginUser.utype,
            "enttid": this.enttid,
            "issysadmin": this.loginUser.issysadmin,
            "wsautoid": this._wsdetails.wsautoid,
            "search": query
        }).subscribe((data) => {
            this.employeeDT = data.data;
        }, err => {
            this._msg.Show(messageType.error, "Error", err);
        }, () => {

        });
    }

    // Selected Employee

    selectEmployeeData(event) {
        this.empid = event.value;
    }

    // Auto Completed Expense

    getExpenseData(event) {
        let query = event.query;

        this._autoservice.getAutoData({
            "flag": "expense",
            "enttid": this.enttid,
            "wsautoid": this._wsdetails.wsautoid,
            "search": query
        }).subscribe((data) => {
            this.expenseDT = data.data;
        }, err => {
            this._msg.Show(messageType.error, "Error", err);
        }, () => {

        });
    }

    // Selected Expense

    selectExpenseData(event) {
        this.expid = event.value;
        this.expname = event.label;
    }

    // Add Multi Row

    addVoucherRow() {
        this.voucherData.push({
            "enttid": this.enttid, "enttname": this.enttname,
            "empid": this.empname.value, "empname": this.empname.label,
            "expid": this.expname.value, "expname": this.expname.label,
            "amt": this.amt, "noofdoc": this.noofdoc, "remark": this.remark
        })

        this.resetVoucherFields();
    }

    // Clear Fields

    resetVoucherFields() {
        this.empid = 0;
        this.empname = [];
        this.expid = 0;
        this.expname = [];
        this.amt = 0;
        this.noofdoc = "";
        this.remark = "";
    }

    // Save Data

    isValidation() {
        var that = this;

        if (that.enttid == 0) {
            that._msg.Show(messageType.error, "Error", "Enter Entity Name");
            $(".enttname input").focus();
        }
        else if (that.empid == 0) {
            that._msg.Show(messageType.error, "Error", "Enter Employye Name");
            $(".expae").focus();
        }
        else if (that.expid == 0) {
            that._msg.Show(messageType.error, "Error", "Enter Expense Name");
            $(".expcd").focus();
        }
        else if (that.amt == 0) {
            that._msg.Show(messageType.error, "Error", "Enter Amount");
            $(".amt ").focus();
        }
        else if (that.noofdoc == "") {
            that._msg.Show(messageType.error, "Error", "Select No Of Docs");
            $(".nodoc ").focus();
        }
        else {
        }
    }

    saveVoucherInfo() {
        var that = this;

        if (that.voucherData.length == 0) {
            that._msg.Show(messageType.error, "Error", "Fill all Voucher Fields");
            $(".enttname input").focus();
        }
        else {
            commonfun.loader();

            that._vchservice.saveVoucherInfo({ "voucherdt": that.voucherData }).subscribe(data => {
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
                        that.enttname.value = data.data[0].enttid;
                        that.enttname.label = data.data[0].enttname;
                        that.empname.value = data.data[0].empid;
                        that.empname.label = data.data[0].empname;
                        that.expid = data.data[0].expid;
                        that.expname.value = data.data[0].expid;
                        that.expname.label = data.data[0].expname;
                        that.amt = data.data[0].amt;
                        that.noofdoc = data.data[0].noofdoc;
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