import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, messageType, MenuService, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { ExpenseService } from '@services/master';
import { LazyLoadEvent } from 'primeng/primeng';
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Component({
    templateUrl: 'rptexp.comp.html',
    providers: [MenuService, CommonService]
})

export class ExpenseReportsComponent implements OnInit, OnDestroy {
    loginUser: LoginUserModel;
    _wsdetails: any = [];
    _enttdetails: any = [];

    frmdt: any = "";
    todt: any = "";

    employeeDT: any = [];
    empdata: any = [];
    empid: number = 0;
    empname: string = "";
    emptype: string = "";

    tagDT: any = [];
    tagdata: any = [];
    tagid: number = 0;
    tagname: string = "";
    taglist: any = [];

    @ViewChild('Expense') stops: ElementRef;

    allocateExpenseDT: any = [];

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService,
        private _loginservice: LoginService, private _autoservice: CommonService, private _expservice: ExpenseService) {
        this.loginUser = this._loginservice.getUser();
        this._wsdetails = Globals.getWSDetails();
        this._enttdetails = Globals.getEntityDetails();

        this.setFromDateAndToDate();
        this.getExpenseReports();
    }

    public ngOnInit() {
        setTimeout(function () {
            commonfun.navistyle();

            $.AdminBSB.islocked = true;
            $.AdminBSB.leftSideBar.Close();
            $.AdminBSB.rightSideBar.activate();
        }, 0);
    }

    // Selected Calendar Date

    formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('-');
    }

    // Format Date

    setFromDateAndToDate() {
        var date = new Date();
        var before7days = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 7);
        var today = new Date(date.getFullYear(), date.getMonth(), date.getDate());

        this.frmdt = this.formatDate(before7days);
        this.todt = this.formatDate(today);
    }

    // Auto Completed Assigned By

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

    // Selected Assigned By

    selectEmployeeData(event, arg) {
        var that = this;

        that.empid = event.value;
        that.empname = event.label;
    }

    // Auto Completed Tag

    getTagData(event) {
        let query = event.query;

        this._autoservice.getAutoData({
            "flag": "tag",
            "enttid": this._enttdetails.enttid,
            "wsautoid": this._wsdetails.wsautoid,
            "search": query
        }).subscribe((data) => {
            this.tagDT = data.data;
        }, err => {
            this._msg.Show(messageType.error, "Error", err);
        }, () => {

        });
    }

    // Selected Tag

    selectTagData(event) {
        this.tagid = event.value;
        this.tagname = event.label;
        this.getTagList();
    }

    // Get Tag List

    getTagList() {
        this.taglist.push({ "tagid": this.tagid, "tagname": this.tagname });

        this.tagid = 0;
        this.tagname = "";
        this.tagdata = [];
    }

    getExpenseReports() {
        var that = this;
        commonfun.loader();

        var tags = that.taglist.length !== 0 ? that.taglist.map(function (val) { return val.tagname; }).join(',') : "";

        that._expservice.getExpenseReports({
            "flag": "reports", "frmdt": that.frmdt, "todt": that.todt, "empid": that.empid, "tag": tags,
            "uid": that.loginUser.uid, "utype": that.loginUser.utype, "enttid": that._enttdetails.enttid,
            "wsautoid": that._wsdetails.wsautoid, "issysadmin": that.loginUser.issysadmin
        }).subscribe(data => {
            try {
                that.allocateExpenseDT = data.data;
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

    // Expand Employee Expense Updated

    expandExpenseDetails(row) {
        let that = this;

        if (row.issh == 0) {
            row.issh = 1;

            if (row.details.length === 0) {
                var params = {
                    "flag": "details", "expdate": row.dispdate, "uid": that.loginUser.uid, "utype": that.loginUser.utype,
                    "enttid": that._enttdetails.enttid, "wsautoid": that._wsdetails.wsautoid, "issysadmin": that.loginUser.issysadmin
                }

                that._expservice.getExpenseReports(params).subscribe(data => {
                    row.details = data.data;

                    for (var i = 0; i < row.details.length; i++) {
                        if (row.details[i].issh == 0) {
                            row.details[i].issh = false;
                        }
                        else {
                            row.details[i].issh = true;
                        }
                    }
                }, err => {
                    that._msg.Show(messageType.error, "Error", err);
                    console.log(err);
                }, () => {

                })
            }
        } else {
            row.issh = 0;
        }
    }

    resetExpenseReports() {
        this.setFromDateAndToDate();
        this.empid = 0;
        this.empname = "";
        this.empdata = [];
        this.tagid = 0;
        this.tagname = "";
        this.tagdata = [];
        this.taglist = [];

        this.getExpenseReports();
    }

    public ngOnDestroy() {
        $.AdminBSB.islocked = false;
        $.AdminBSB.leftSideBar.Open();
    }
}
