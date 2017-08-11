import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, MenuService, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { VoucherService } from '@services/master';
import { Cookie } from 'ng2-cookies/ng2-cookies';

declare var $: any;
declare var commonfun: any;

@Component({
    templateUrl: 'addvcr.comp.html',
    providers: [CommonService]
})

export class AddVoucherComponent implements OnInit {
    loginUser: LoginUserModel;
    _wsdetails: any = [];
    _enttdetails: any = [];

    autoid: number = 0;

    employeeDT: any = [];
    empdata: any = [];
    empid: number = 0;
    empname: string = "";

    expenseDT: any = [];
    expdata: any = [];
    expid: number = 0;
    expname: string = "";

    amount: number = 0;
    noofdoc: string = "";
    remark: string = "";

    voucherData: any = [];

    private subscribeParameters: any;

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService, private _loginservice: LoginService,
        private _vchservice: VoucherService, private _autoservice: CommonService) {
        this.loginUser = this._loginservice.getUser();
        this._wsdetails = Globals.getWSDetails();
        this._enttdetails = Globals.getEntityDetails();
    }

    public ngOnInit() {
        setTimeout(function () {
            $(".frmdt").focus();
        }, 100);

        this.getVoucherDetails();
    }

    // Auto Completed Employee

    getEmployeeData(event) {
        let query = event.query;

        this._autoservice.getAutoData({
            "flag": "employee",
            "uid": this.loginUser.uid,
            "ucode": this.loginUser.ucode,
            "utype": this.loginUser.utype,
            "enttid": this._enttdetails.enttid,
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
        this.empname = event.label;
    }

    // Auto Completed Expense

    getExpenseData(event) {
        let query = event.query;

        this._autoservice.getAutoData({
            "flag": "exmpwiseexp",
            "enttid": this._enttdetails.enttid,
            "empid": this.empid,
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
        var that = this;

        if (that.empid == 0) {
            that._msg.Show(messageType.error, "Error", "Enter Employye Name");
            $(".empname input").focus();
        }
        else if (that.expid == 0) {
            that._msg.Show(messageType.error, "Error", "Enter Expense Name");
            $(".expname input").focus();
        }
        else if (that.amount == 0) {
            that._msg.Show(messageType.error, "Error", "Enter Amount");
            $(".amount").focus();
        }
        else if (that.noofdoc == "") {
            that._msg.Show(messageType.error, "Error", "Select No Of Docs");
            $(".noofdoc").focus();
        }
        else {
            that.voucherData.push({
                "autoid": that.autoid, "enttid": that._enttdetails.enttid, "enttname": that._enttdetails.enttname,
                "empid": that.empid, "empname": that.empname, "expid": that.expid, "expname": that.expname,
                "amount": that.amount, "noofdoc": that.noofdoc, "remark": that.remark,
                "cuid": that.loginUser.ucode, "wsautoid": that._wsdetails.wsautoid, "isactive": true
            })

            that.resetVoucherFields();
        }
    }

    // Clear Fields

    resetVoucherFields() {
        this.expid = 0;
        this.expname = "";
        this.expdata = [];
        this.amount = 0;
        this.noofdoc = "";
        this.remark = "";
    }

    // Save Data

    isValidation() {
    }

    saveVoucherInfo() {
        var that = this;

        if (that.voucherData.length == 0) {
            that._msg.Show(messageType.error, "Error", "Fill all Voucher Fields");
            $(".enttname input").focus();
        }
        else {
            commonfun.loader();

            that._vchservice.saveVoucherInfo({ "voucherdata": that.voucherData }).subscribe(data => {
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
                        that.empid = data.data[0].empid;
                        that.empname = data.data[0].empname;
                        that.empdata.value = that.empid;
                        that.empdata.label = that.empname;

                        that.expid = data.data[0].expid;
                        that.expname = data.data[0].expname;
                        that.expdata.expid = that.expid;
                        that.expdata.expname = that.expname;
                        that.amount = data.data[0].amount;
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