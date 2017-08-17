import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { TeamEmployeeMapService } from '@services/master';
import { Cookie } from 'ng2-cookies/ng2-cookies';

declare var google: any;

@Component({
    templateUrl: 'addtem.comp.html',
    providers: [CommonService]
})

export class AddTeamEmployeeMapComponent implements OnInit {
    loginUser: LoginUserModel;
    _wsdetails: any = [];
    _enttdetails: any = [];

    temid: number = 0;

    employeeDT: any = [];
    empdata: any = [];
    empid: number = 0;
    empname: string = "";
    employeeList: any = [];

    teamDT: any = [];
    tmdata: any = [];
    tmid: number = 0;
    tmnm: string = "";

    private subscribeParameters: any;

    constructor(private _temservice: TeamEmployeeMapService, private _routeParams: ActivatedRoute, private _router: Router,
        private _loginservice: LoginService, private _msg: MessageService, private _autoservice: CommonService) {
        this.loginUser = this._loginservice.getUser();
        this._wsdetails = Globals.getWSDetails();
        this._enttdetails = Globals.getEntityDetails();
    }

    public ngOnInit() {
        this.getTeamEmployeeMap();
    }

    // Auto Completed Team

    getTeamData(event) {
        let query = event.query;

        this._autoservice.getAutoData({
            "flag": "team",
            "uid": this.loginUser.uid,
            "ucode": this.loginUser.ucode,
            "utype": this.loginUser.utype,
            "enttid": this._enttdetails.enttid,
            "issysadmin": this.loginUser.issysadmin,
            "wsautoid": this._wsdetails.wsautoid,
            "search": query
        }).subscribe((data) => {
            this.teamDT = data.data;
        }, err => {
            this._msg.Show(messageType.error, "Error", err);
        }, () => {

        });
    }

    // Selected Team

    selectTeamData(event) {
        this.tmid = event.value;
        this.getTeamEmployeeMap();
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

        this.addEmployeeList();
    }

    // Check Duplicate Employee

    isDuplicateEmployee() {
        var that = this;

        for (var i = 0; i < that.employeeList.length; i++) {
            var field = that.employeeList[i];

            if (field.empid == this.empid) {
                this._msg.Show(messageType.error, "Error", "Duplicate Employee not Allowed");
                return true;
            }
        }

        return false;
    }

    // Read Get Employee

    addEmployeeList() {
        var that = this;
        commonfun.loader("#divEmployee");

        var duplicateEmployee = that.isDuplicateEmployee();

        if (!duplicateEmployee) {
            that.employeeList.push({
                "temid": that.temid,
                "enttid": that._enttdetails.enttid, "enttname": that._enttdetails.enttname,
                "tmid": that.tmid, "tmnm": that.tmnm,
                "empid": that.empid, "empname": that.empname,
                "wsautoid": that._wsdetails.wsautoid, "isactive": true
            });
        }

        that.empid = 0;
        that.empname = "";
        that.empdata = [];
        $(".empname input").focus();
        commonfun.loaderhide("#divEmployee");
    }

    // Delete Employee

    deleteEmployee(row) {
        // this.employeeList.splice(this.employeeList.indexOf(row), 1);
        row.isactive = false;
    }

    // Clear Fields

    resetEmployeeFields() {
        var that = this;

        that.tmid = 0;
        that.tmnm = "";
        that.tmdata = [];
        that.empid = 0;
        that.empname = "";
        that.empdata = [];
        that.employeeList = [];
    }

    // Save Data

    saveTeamEmployeeMap() {
        var that = this;

        if (that.tmid == 0) {
            that._msg.Show(messageType.error, "Error", "Enter Team Name");
            $(".tmnm input").focus();
        }
        else if (that.employeeList.length == 0) {
            that._msg.Show(messageType.error, "Error", "Enter atleast 1 Employee");
            $(".empname input").focus();
        }
        else {
            commonfun.loader();

            var saveegm = {
                "temdata": that.employeeList
            }

            this._temservice.saveTeamEmployeeMap(saveegm).subscribe(data => {
                try {
                    var dataResult = data.data[0].funsave_teamempmap;
                    var msg = dataResult.msg;
                    var msgid = dataResult.msgid;

                    if (msgid != "-1") {
                        that._msg.Show(messageType.success, "Success", msg);
                        that.resetEmployeeFields();
                    }
                    else {
                        that._msg.Show(messageType.error, "Error", msg);
                    }

                    commonfun.loaderhide();
                }
                catch (e) {
                    that._msg.Show(messageType.error, "Error", e);
                }
            }, err => {
                that._msg.Show(messageType.error, "Error", err);
                console.log(err);
                commonfun.loaderhide();
            }, () => {
                // console.log("Complete");
            });
        }
    }

    // Get Employee Data

    getTeamEmployeeMap() {
        var that = this;
        commonfun.loader("#divTeam");

        that._temservice.getTeamEmployeeMap({
            "flag": "edit",
            "enttid": that._enttdetails.enttid,
            "tmid": that.tmid,
            "wsautoid": that._wsdetails.wsautoid
        }).subscribe(data => {
            try {
                that.employeeList = data.data;
            }
            catch (e) {
                that._msg.Show(messageType.error, "Error", e);
            }

            commonfun.loaderhide("#divTeam");
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
            console.log(err);
            commonfun.loaderhide("#divTeam");
        }, () => {

        })
    }
}
