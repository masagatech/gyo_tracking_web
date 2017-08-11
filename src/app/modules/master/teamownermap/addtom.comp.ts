import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { TeamEmployeeMapService, TeamOwnershipMapService } from '@services/master';
import { Cookie } from 'ng2-cookies/ng2-cookies';

declare var google: any;

@Component({
    templateUrl: 'addtom.comp.html',
    providers: [CommonService]
})

export class AddTeamOwnershipComponent implements OnInit {
    loginUser: LoginUserModel;
    _wsdetails: any = [];
    _enttdetails: any = [];

    tomid: number = 0;

    employeeList: any = [];

    ownershipDT: any = [];
    ownershipList: any = [];
    onrid: number = 0;
    onrname: any = [];

    teamDT: any = [];
    tmid: number = 0;
    tmnm: any = [];

    private subscribeParameters: any;

    constructor(private _temservice: TeamEmployeeMapService, private _tomservice: TeamOwnershipMapService, private _routeParams: ActivatedRoute,
        private _router: Router, private _loginservice: LoginService, private _msg: MessageService, private _autoservice: CommonService) {
        this.loginUser = this._loginservice.getUser();
        this._wsdetails = Globals.getWSDetails();
        this._enttdetails = Globals.getEntityDetails();
    }

    public ngOnInit() {
        this.getTeamOwnershipMap();
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
        this.getTeamOwnershipMap();
    }

    // Get Team Employee Data

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
                if (data.data.length > 0) {
                    that.employeeList = data.data;
                }
                else {
                    that._msg.Show(messageType.error, "Error", "There are no Employee");
                    that.tmid = 0;
                    that.tmnm = [];
                    that.employeeList = [];
                    $(".tmnm input").focus();
                }
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

    // Auto Completed Employee

    getOwnershipData(event) {
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
            this.ownershipDT = data.data;
        }, err => {
            this._msg.Show(messageType.error, "Error", err);
        }, () => {

        });
    }

    // Selected Employee

    selectOwnershipData(event) {
        this.onrid = event.value;
        this.addOwnershipList();
    }

    // Check Duplicate Employee

    isDuplicateOwnership() {
        var that = this;

        for (var i = 0; i < that.ownershipList.length; i++) {
            var field = that.ownershipList[i];

            if (field.onrid == this.onrid) {
                this._msg.Show(messageType.error, "Error", "Duplicate Employee not Allowed");
                return true;
            }
        }

        return false;
    }

    // Read Get Employee

    addOwnershipList() {
        var that = this;
        commonfun.loader("#divEmployee");

        var duplicateOwnership = that.isDuplicateOwnership();

        if (!duplicateOwnership) {
            that.ownershipList.push({
                "tomid": that.tomid,
                "enttid": that._enttdetails.enttid, "enttname": that._enttdetails.enttname,
                "tmid": that.tmnm.value, "tmnm": that.tmnm.label,
                "onrid": that.onrname.value, "onrname": that.onrname.label,
                "wsautoid": that._wsdetails.wsautoid, "isactive": true
            });
        }

        that.onrid = 0;
        that.onrname = [];
        $(".onrname input").focus();
        commonfun.loaderhide("#divOwnership");
    }

    // Delete Ownership

    deleteOwnership(row) {
        this.ownershipList.splice(this.ownershipList.indexOf(row), 1);
        row.isactive = false;
    }

    // Clear Fields

    resetOwnershipFields() {
        var that = this;

        that.tmid = 0;
        that.tmnm = [];
        that.onrid = 0;
        that.onrname = [];
        that.employeeList = [];
        that.ownershipList = [];
    }

    // Save Data

    saveTeamOwnershipMap() {
        var that = this;

        if (that.tmid == 0) {
            that._msg.Show(messageType.error, "Error", "Enter Team Name");
            $(".tmnm input").focus();
        }
        else if (that.employeeList.length == 0) {
            that._msg.Show(messageType.error, "Error", "Enter atleast 1 Ownership");
            $(".onrname input").focus();
        }
        else {
            commonfun.loader();

            var saveogm = {
                "tomdata": that.ownershipList
            }

            this._tomservice.saveTeamOwnershipMap(saveogm).subscribe(data => {
                try {
                    var dataResult = data.data[0].funsave_teamownermap;
                    var msg = dataResult.msg;
                    var msgid = dataResult.msgid;

                    if (msgid != "-1") {
                        that._msg.Show(messageType.success, "Success", msg);
                        that.resetOwnershipFields();
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

    // Get Ownership Data

    getTeamOwnershipMap() {
        var that = this;
        commonfun.loader("#divTeam");

        that._tomservice.getTeamOwnershipMap({
            "flag": "edit",
            "enttid": that._enttdetails.enttid,
            "tmid": that.tmid,
            "wsautoid": that._wsdetails.wsautoid
        }).subscribe(data => {
            try {
                that.ownershipList = data.data;
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
