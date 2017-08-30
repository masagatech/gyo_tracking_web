import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { UserService } from '@services/master';
import { LoginUserModel, Globals } from '@models';
import jsPDF from 'jspdf'

@Component({
    templateUrl: 'rptlog.comp.html',
    providers: [CommonService]
})

export class LoginLogReportsComponent implements OnInit, OnDestroy {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    frmdt: any = "";
    todt: any = "";
    uid: number = 0;

    loginlogDT: any = [];
    logdetailsDT: any = [];

    ucode: string = "";
    fullname: string = "";

    @ViewChild('loginlog') loginlog: ElementRef;

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService,
        private _loginservice: LoginService, private _userservice: UserService,
        private _autoservice: CommonService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.setFromDateAndToDate();
        this.getLoginLog();
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
        var before1month = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 30);
        var today = new Date(date.getFullYear(), date.getMonth(), date.getDate());

        this.frmdt = this.formatDate(before1month);
        this.todt = this.formatDate(today);
    }

    // Get Menu Log

    getLoginLog() {
        var that = this;

        that._userservice.getUserLoginLog({
            "flag": "maxlog", "frmdt": that.frmdt, "todt": that.todt, "uid": that.uid, "wsautoid": that._enttdetails.wsautoid
        }).subscribe(data => {
            try {
                that.loginlogDT = data.data;
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

        $("#loginModal").modal('show');
        commonfun.loader("#loginModal");

        that._userservice.getUserLoginLog({
            "flag": "userwise", "logtime": row.lastdate, "uid": row.loginid
        }).subscribe(data => {
            try {
                if (data.data.length !== 0) {
                    that.logdetailsDT = data.data;
                }
                else {
                    that.logdetailsDT = [];
                }

                that.ucode = that.logdetailsDT[0].ucode;
                that.fullname = that.logdetailsDT[0].fullname;
            }
            catch (e) {
                that._msg.Show(messageType.error, "Error", e);
            }

            commonfun.loaderhide("#loginModal");
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
            console.log(err);
            commonfun.loaderhide("#loginModal");
        }, () => {

        })
    }

    // Export

    public exportToCSV() {
        this._autoservice.exportToCSV(this.loginlogDT, "Login Log Details");
    }

    public exportToPDF() {
        let pdf = new jsPDF('l', 'pt', 'a4');
        let options = {
            pagesplit: true
        };
        pdf.addHTML(this.loginlog.nativeElement, 0, 0, options, () => {
            pdf.save("LoginLogDetials.pdf");
        });
    }

    public ngOnDestroy() {
        $.AdminBSB.islocked = false;
        $.AdminBSB.leftSideBar.Open();
    }
}
