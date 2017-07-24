import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, MenuService, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { ExpenseService } from '@services/master';
import { Cookie } from 'ng2-cookies/ng2-cookies';

declare var $: any;
declare var commonfun: any;

@Component({
    templateUrl: 'addexp.comp.html',
    providers: [CommonService]
})

export class AddExpenseComponent implements OnInit {
    loginUser: LoginUserModel;

    _wsdetails: any = [];

    entityDT: any = [];
    enttid: number = 0;
    enttname: string = "";

    expid: number = 0;
    expcd: string = "";
    expnm: string = "";
    expdesc: string = "";
    exptype: string = "";
    expamt: any = 0;
    amttype: string = "";

    exptypeDT: any = [];
    amttypeDT: any = [];

    private subscribeParameters: any;

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService, private _loginservice: LoginService,
        private _expservice: ExpenseService, private _autoservice: CommonService) {
        this.loginUser = this._loginservice.getUser();
        this._wsdetails = Globals.getWSDetails();
        this.fillExpenseTypeDDL();
    }

    public ngOnInit() {
        setTimeout(function () {
            $(".frmdt").focus();
        }, 100);

        this.getExpenseDetails();
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

    // Fill DropDown List

    fillExpenseTypeDDL() {
        var that = this;

        that._expservice.getExpenseDetails({ "flag": "dropdown" }).subscribe(data => {
            try {
                that.exptypeDT = data.data.filter(a => a.group === "exptype");
                that.amttypeDT = data.data.filter(a => a.group === "amttype");
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

    // Clear Fields

    resetExpenseFields() {
        this.expcd = "";
        this.expnm = "";
        this.expdesc = "";
        this.exptype = "";
        this.expamt = 0;
        this.amttype = "";
    }

    // Save Data

    saveExpenseInfo() {
        var that = this;

        if (that.enttid == 0) {
            that._msg.Show(messageType.error, "Error", "Enter Entity Name");
            $(".enttname input").focus();
        }
        else if (that.expcd == "") {
            that._msg.Show(messageType.error, "Error", "Enter Expense Code");
            $(".expcd").focus();
        }
        else if (that.expnm == "") {
            that._msg.Show(messageType.error, "Error", "Enter Expense Name");
            $(".expnm").focus();
        }
        else if (that.exptype == "") {
            that._msg.Show(messageType.error, "Error", "Select Expense Type");
            $(".exptype ").focus();
        }
        else if (that.amttype == "") {
            that._msg.Show(messageType.error, "Error", "Select Amount Type");
            $(".amttype ").focus();
        }
        else {
            commonfun.loader();

            var saveExpense = {
                "expid": that.expid,
                "expcd": that.expcd,
                "expnm": that.expnm,
                "expdesc": that.expdesc,
                "exptype": that.exptype,
                "amttype": that.amttype,
                "expamt": that.expamt,
                "enttid": that.enttid,
                "cuid": that.loginUser.ucode,
                "wsautoid": that._wsdetails.wsautoid,
                "mode": ""
            }

            that._expservice.saveExpenseInfo(saveExpense).subscribe(data => {
                try {
                    var dataResult = data.data[0].funsave_expenseinfo;
                    var msg = dataResult.msg;
                    var msgid = dataResult.msgid;

                    if (msgid != "-1") {
                        that._msg.Show(messageType.success, "Success", msg);

                        if (msgid == "1") {
                            that.resetExpenseFields();
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

    // Get Team Data

    getExpenseDetails() {
        var that = this;
        var params = {};

        commonfun.loader();

        that.subscribeParameters = that._routeParams.params.subscribe(params => {
            if (params['id'] !== undefined) {
                that.expid = params['id'];

                params = {
                    "flag": "edit",
                    "expid": that.expid,
                    "wsautoid": that._wsdetails.wsautoid
                }

                that._expservice.getExpenseDetails(params).subscribe(data => {
                    try {
                        that.enttid = data.data[0].enttid;
                        that.enttname = data.data[0].enttname;
                        that.expid = data.data[0].expid;
                        that.expcd = data.data[0].expcd;
                        that.expnm = data.data[0].expnm;
                        that.expdesc = data.data[0].expdesc;
                        that.exptype = data.data[0].exptype;
                        that.expamt = data.data[0].expamt;
                        that.amttype = data.data[0].amttype;
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
                that.resetExpenseFields();
                commonfun.loaderhide();
            }
        });
    }

    // Back For View Data

    backViewData() {
        this._router.navigate(['/master/expense']);
    }
}