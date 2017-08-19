import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, messageType, MenuService, LoginService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';
import jsPDF from 'jspdf'

@Component({
    templateUrl: 'rptmnlg.comp.html',
    providers: [MenuService]
})

export class MenuLogReportsComponent implements OnInit, OnDestroy {
    loginUser: LoginUserModel;
    _wsdetails: any = [];

    frmdt: any = "";
    todt: any = "";
    uid: number = 0;

    menulogDT: any = [];
    logdetailsDT: any = [];

    ucode: string = "";
    fullname: string = "";

    @ViewChild('menulog') menulog: ElementRef;

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService,
        public _menuservice: MenuService, private _loginservice: LoginService) {
        this.loginUser = this._loginservice.getUser();
        this._wsdetails = Globals.getWSDetails();

        this.setFromDateAndToDate();
        this.getMenuLog();
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
        var today = new Date(date.getFullYear(), date.getMonth(), date.getDate());

        this.frmdt = this.formatDate(today);
        this.todt = this.formatDate(today);
    }

    // Get Menu Log

    getMenuLog() {
        var that = this;

        commonfun.loader();

        that._menuservice.getMenuLog({
            "flag": "maxlog", "frmdt": that.frmdt, "todt": that.todt, "uid": that.uid, "wsautoid": that._wsdetails.wsautoid
        }).subscribe(data => {
            try {
                that.menulogDT = data.data;
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

    // Get Log Details

    getLogDetails(row) {
        var that = this;

        $("#menuModal").modal('show');
        commonfun.loader("#menuModal");

        that._menuservice.getMenuLog({
            "flag": "userwise", "logtime": row.lastdate, "uid": row.loginid, "menuid": row.menuid
        }).subscribe(data => {
            try {
                that.logdetailsDT = data.data;

                that.ucode = that.logdetailsDT[0].ucode;
                that.fullname = that.logdetailsDT[0].fullname;
            }
            catch (e) {
                that._msg.Show(messageType.error, "Error", e);
            }

            commonfun.loaderhide("#menuModal");
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
            console.log(err);
            commonfun.loaderhide("#menuModal");
        }, () => {

        })
    }

    // Export

    public exportToCSV() {
        var that = this;

        commonfun.loader("#btnExport");

        that._menuservice.getMenuLog({
            "flag": "export", "frmdt": that.frmdt, "todt": that.todt, "uid": that.uid, "wsautoid": that._wsdetails.wsautoid
        }).subscribe(data => {
            try {
                new Angular2Csv(data.data, 'MenuLogDetails', { "showLabels": true });
            }
            catch (e) {
                that._msg.Show(messageType.error, "Error", e);
            }

            commonfun.loaderhide("#btnExport");
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
            console.log(err);
            commonfun.loaderhide("#btnExport");
        }, () => {

        })
    }

    public exportToPDF() {
        let pdf = new jsPDF('l', 'pt', 'a4');
        let options = {
            pagesplit: true
        };
        pdf.addHTML(this.menulog.nativeElement, 0, 0, options, () => {
            pdf.save("MenuLogDetail.pdf");
        });
    }

    public ngOnDestroy() {
        $.AdminBSB.islocked = false;
        $.AdminBSB.leftSideBar.Open();
    }
}
