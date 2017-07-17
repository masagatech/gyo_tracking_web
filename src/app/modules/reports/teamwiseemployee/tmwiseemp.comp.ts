import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, messageType, LoginService, MenuService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { ReportsService } from '@services/master';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';
import jsPDF from 'jspdf'

@Component({
    templateUrl: 'tmwiseemp.comp.html',
    providers: [MenuService, CommonService]
})

export class TeamWiseEmployeeComponent implements OnInit, OnDestroy {
    loginUser: LoginUserModel;
    _wsdetails: any = [];

    entityDT: any = [];
    enttid: number = 0;
    enttname: string = "";

    batchDT: any = [];
    batchid: number = 0;

    exportData: any = [];
    teamDT: any = [];
    employeeDT: any = [];

    grpname: string = "";
    empname: string = "";

    @ViewChild('grpwiseemp') grpwiseemp: ElementRef;

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService, public _menuservice: MenuService,
        private _loginservice: LoginService, private _rptservice: ReportsService, private _autoservice: CommonService) {
        this.loginUser = this._loginservice.getUser();
        this._wsdetails = Globals.getWSDetails();

        this.viewTeamWiseEmployee();
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

    public viewTeamWiseEmployee() {
        var that = this;

        that.enttid = parseInt(Cookie.get('_enttid_'));
        that.enttname = Cookie.get('_enttnm_');

        that.getEntityWiseTeam();
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

        this.getEntityWiseTeam();
    }

    // View Team List

    getEntityWiseTeam() {
        var that = this;
        commonfun.loader();

        that._rptservice.getTeamWiseEmployeeReports({
            "flag": "group", "enttid": that.enttid, "wsautoid": that._wsdetails.wsautoid
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

    getTeamWiseEmployeeReports(row) {
        var that = this;

        commonfun.loader("#ddlemp");

        that._rptservice.getTeamWiseEmployeeReports({
            "flag": "employee", "enttid": that.enttid, "grpid": row.grpid, "wsautoid": that._wsdetails.wsautoid
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

        that._rptservice.getTeamWiseEmployeeReports({
            "flag": "rtwise", "stpid": row.stpid, "enttid": row.schoolid, "rtid": row.rtid,
            "batchid": row.batchid, "wsautoid": that._wsdetails.wsautoid
        }).subscribe(data => {
            try {
                if (data.data.length > 0) {
                    that.employeeDT = data.data;
                    that.grpname = data.data[0].grpname;
                    that.empname = data.data[0].empname;
                }
                else {
                    that.employeeDT = [];
                    that.grpname = "";
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

        that._rptservice.getTeamWiseEmployeeReports({
            "flag": "export", "enttid": that.enttid, "wsautoid": that._wsdetails.wsautoid
        }).subscribe(data => {
            try {
                that.exportData = data.data;
                new Angular2Csv(that.exportData, 'GroupWiseEmployee', { "showLabels": true });
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
