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

    expcode: number = 0;
    expnm: string = "";
    exptype: string = "";
    dpt: string = "";
    amt: number = 0;


    private subscribeParameters: any;

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService, private _loginservice: LoginService,
        private _expservice: ExpenseService, private _autoservice: CommonService) {
        this.loginUser = this._loginservice.getUser();
        this._wsdetails = Globals.getWSDetails();
    }

    public ngOnInit() {
        setTimeout(function () {
            $(".frmdt").focus();
        }, 100);

        this.getExpenseDetails();
    }

    // Clear Fields

    resetExpenseFields() {
        this.expcode = 0;
        this.expnm = "";
        this.exptype = "";
        this.dpt = "";
        this.amt = 0;

    }

    // Save Data

    saveExpenseInfo() {
        var that = this;

        if (that.expnm == "") {
            that._msg.Show(messageType.error, "Error", "Enter Expense");
            $(".expnm").focus();
        }
        else if (that.exptype == "") {
            that._msg.Show(messageType.error, "Error", "Enter ExpenseType");
            $(".exptype ").focus();
        }
        else {
            commonfun.loader();

            var saveExpense = {
                "expcode": that.expcode,
                "expnm": that.expnm,
                "exptype": that.exptype,
                "dpt": that.dpt,
                "amt": that.amt,
                "cuid": that.loginUser.ucode,
                "wsautoid": that._wsdetails.wsautoid,
                "mode": ""
            }

            that._expservice.saveExpenseInfo(saveExpense).subscribe(data => {
                try {
                    var dataResult = data.data[0].funsave_teaminfo;
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
            if (params['code'] !== undefined) {
                that.expcode = params['code'];

                params = {
                    "flag": "edit",
                    "expcode": that.expcode,
                    "wsautoid": that._wsdetails.wsautoid
                }

                that._expservice.getExpenseDetails(params).subscribe(data => {
                    try {
                        that.expcode = data.data[0].expcode;
                        that.expnm = data.data[0].tmnm;
                        that.exptype = data.data[0].exptype;
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