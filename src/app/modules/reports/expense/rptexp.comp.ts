import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { MessageService, messageType, MenuService, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { ExpenseService } from '@services/master';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';
import jsPDF from 'jspdf'

@Component({
    templateUrl: 'rptexp.comp.html',
    providers: [MenuService, CommonService]
})

export class ExpenseReportsComponent implements OnInit, OnDestroy {
    loginUser: LoginUserModel;
    _wsdetails: any = [];

    expDT: any = [];

    entityDT: any = [];
    enttid: number = 0;
    enttname: string = "";

    employeeDT: any = [];
    empid: number = 0;
    empname: string = "";

    @ViewChild('expense') expense: ElementRef;

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService, public _menuservice: MenuService,
        private _loginservice: LoginService, private _expservice: ExpenseService, private _autoservice: CommonService) {
        this.loginUser = this._loginservice.getUser();
        this._wsdetails = Globals.getWSDetails();
        this.viewExpenseDataRights();
    }

    public ngOnInit() {
        var that = this;

        setTimeout(function () {
            $(".enttname input").focus();
            commonfun.navistyle();

            $.AdminBSB.islocked = true;
            $.AdminBSB.leftSideBar.Close();
            $.AdminBSB.rightSideBar.activate();
        }, 100);
    }

    // Export

    public exportToCSV() {
        new Angular2Csv(this.expDT, 'Expense Details', { "showLabels": true });
    }

    public exportToPDF() {
        let pdf = new jsPDF('l', 'pt', 'a4');
        let options = {
            pagesplit: true
        };
        pdf.addHTML(this.expense.nativeElement, 0, 0, options, () => {
            pdf.save("ExpenseReports.pdf");
        });
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

        Cookie.set("_enttid_", this.enttid.toString());
        Cookie.set("_enttnm_", this.enttname);
    }

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
        this.empname = event.label;
    }

    public viewExpenseDataRights() {
        var that = this;

        if (Cookie.get('_enttnm_') != null) {
            that.enttid = parseInt(Cookie.get('_enttid_'));
            that.enttname = Cookie.get('_enttnm_');
            that.getExpenseDetails();
        }
    }

    getExpenseDetails() {
        var that = this;

        commonfun.loader();

        that._expservice.getExpenseDetails({
            "flag": "reports", "empid": that.empid, "enttid": that.enttid, "wsautoid": that._wsdetails.wsautoid,
    
        }).subscribe(data => {
            try {
                that.expDT = data.data;
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

    public ngOnDestroy() {
        $.AdminBSB.islocked = false;
        $.AdminBSB.leftSideBar.Open();
    }
}