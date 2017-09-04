import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { EmployeeService } from '@services/master';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import jsPDF from 'jspdf'

@Component({
    templateUrl: 'tmwiseemp.comp.html',
    providers: [CommonService]
})

export class TeamWiseEmployeeComponent implements OnInit, OnDestroy {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    batchDT: any = [];
    batchid: number = 0;

    teamDT: any = [];
    employeeDT: any = [];

    tmnm: string = "";
    empname: any = [];

    @ViewChild('grpwiseemp') grpwiseemp: ElementRef;

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService,
        private _loginservice: LoginService, private _rptempservice: EmployeeService, private _autoservice: CommonService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.getEntityWiseTeam();
    }

    public ngOnInit() {
        setTimeout(function () {
            commonfun.navistyle();
            $(".enttname input").focus();

            $.AdminBSB.islocked = true;
            $.AdminBSB.leftSideBar.Close();
            $.AdminBSB.rightSideBar.activate();
        }, 100);
    }

    // View Team List

    getEntityWiseTeam() {
        var that = this;
        commonfun.loader();

        that._rptempservice.getTeamWiseEmployeeReports({
            "flag": "team", "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid
        }).subscribe(data => {
            try {
                that.teamDT = data.data;
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

    // View Employee List

    getTeamWiseEmployee(row) {
        var that = this;

        commonfun.loader("#ddlemp");

        that._rptempservice.getTeamWiseEmployeeReports({
            "flag": "employee", "enttid": that._enttdetails.enttid, "tmid": row.tmid, "wsautoid": that._enttdetails.wsautoid
        }).subscribe(data => {
            try {
                row.empDT = data.data;
            }
            catch (e) {
                that._msg.Show(messageType.error, "Error", e);
            }

            commonfun.loaderhide("#ddlemp");
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
            console.log(err);
            commonfun.loaderhide("#ddlemp");
        }, () => {

        })
    }

    // View Employee List

    getEmployeeDetails(row) {
        var that = this;

        $("#EmployeeModal").modal('show');
        commonfun.loader("#EmployeeModal");

        that.employeeDT = [];

        that._rptempservice.getTeamWiseEmployeeReports({
            "flag": "rtwise", "stpid": row.stpid, "enttid": row.schoolid, "rtid": row.rtid,
            "batchid": row.batchid, "wsautoid": that._enttdetails.wsautoid
        }).subscribe(data => {
            try {
                if (data.data.length > 0) {
                    that.employeeDT = data.data;
                    that.tmnm = data.data[0].tmnm;
                    that.empname.label = data.data[0].empname;
                }
                else {
                    that.employeeDT = [];
                    that.tmnm = "";
                    that.empname = "";
                }
            }
            catch (e) {
                that._msg.Show(messageType.error, "Error", e);
            }
            commonfun.loaderhide("#EmployeeModal");
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
            console.log(err);
            commonfun.loaderhide("#EmployeeModal");
        }, () => {

        })
    }

    // Export

    exportToCSV() {
        var that = this;

        commonfun.loader("#exportemp");

        that._rptempservice.getTeamWiseEmployeeReports({
            "flag": "export", "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid
        }).subscribe(data => {
            try {
                that._autoservice.exportToCSV(data.data, "Team Wise Employee");
            }
            catch (e) {
                that._msg.Show(messageType.error, "Error", e);
            }

            commonfun.loaderhide("#exportemp");
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
            console.log(err);
            commonfun.loaderhide("#exportemp");
        }, () => {

        })
    }

    public exportToPDF() {
        let pdf = new jsPDF('l', 'pt', 'a4');
        let options = {
            pagesplit: true
        };
        pdf.addHTML(this.grpwiseemp.nativeElement, 0, 0, options, () => {
            pdf.save("GroupWiseEmployee.pdf");
        });
    }

    public ngOnDestroy() {
        $.AdminBSB.islocked = false;
        $.AdminBSB.leftSideBar.Open();
    }
}
