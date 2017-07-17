import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { EmpGroupMapService, OwnershipTeamMapService } from '@services/master';
import { Cookie } from 'ng2-cookies/ng2-cookies';

declare var google: any;

@Component({
    templateUrl: 'tmonrmap.comp.html',
    providers: [CommonService]
})

export class TeamOwnershipComponent implements OnInit {
    loginUser: LoginUserModel;

    egmid: number = 0;

    entityDT: any = [];
    enttid: number = 0;
    enttname: string = "";

    employeeList: any = [];

    ownershipDT: any = [];
    ownershipList: any = [];
    onrid: number = 0;
    onrname: string = "";

    groupDT: any = [];
    grpid: number = 0;
    grpname: string = "";

    _wsdetails: any = [];
    private subscribeParameters: any;

    constructor(private _egmservice: EmpGroupMapService, private _ogmservice: OwnershipTeamMapService, private _routeParams: ActivatedRoute,
        private _router: Router, private _loginservice: LoginService, private _msg: MessageService, private _autoservice: CommonService) {
        this.loginUser = this._loginservice.getUser();
        this._wsdetails = Globals.getWSDetails();
    }

    public ngOnInit() {
        setTimeout(function () {
            $(".enttname input").focus();
        }, 100);

        this.getTeamOwnership();
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

    // Auto Completed Group

    getGroupData(event) {
        let query = event.query;

        this._autoservice.getAutoData({
            "flag": "group",
            "uid": this.loginUser.uid,
            "ucode": this.loginUser.ucode,
            "utype": this.loginUser.utype,
            "issysadmin": this.loginUser.issysadmin,
            "wsautoid": this._wsdetails.wsautoid,
            "search": query
        }).subscribe((data) => {
            this.groupDT = data.data;
        }, err => {
            this._msg.Show(messageType.error, "Error", err);
        }, () => {

        });
    }

    // Selected Group

    selectGroupData(event) {
        this.grpid = event.value;
        this.grpname = event.label;

        this.getGroupEmployee();
        this.getTeamOwnership();
    }

    // Get Group Employee Data

    getGroupEmployee() {
        var that = this;
        commonfun.loader("#divGroup");

        that._egmservice.getEmpGroupMap({
            "flag": "edit",
            "enttid": that.enttid,
            "grpid": that.grpid,
            "wsautoid": that._wsdetails.wsautoid
        }).subscribe(data => {
            try {
                if (data.data.length > 0) {
                    that.employeeList = data.data;
                }
                else {
                    that._msg.Show(messageType.error, "Error", "There are no Employee");
                    that.grpid = 0;
                    that.grpname = "";
                    that.employeeList = [];
                    $(".grpname input").focus();
                }
            }
            catch (e) {
                that._msg.Show(messageType.error, "Error", e);
            }

            commonfun.loaderhide("#divGroup");
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
            console.log(err);
            commonfun.loaderhide("#divGroup");
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
            "enttid": this.enttid,
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
        this.onrname = event.label;

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
                "ogmid": that.egmid,
                "enttid": that.enttid, "enttname": that.enttname,
                "grpid": that.grpid, "grpname": that.grpname,
                "onrid": that.onrid, "onrname": that.onrname,
                "wsautoid": that._wsdetails.wsautoid, "isactive": true
            });
        }

        that.onrid = 0;
        that.onrname = "";
        $(".onrname input").focus();
        commonfun.loaderhide("#divOwnership");
    }

    // Delete Ownership

    deleteOwnership(row) {
        this.employeeList.splice(this.employeeList.indexOf(row), 1);
        row.isactive = false;
    }

    // Clear Fields

    resetOwnershipFields() {
        var that = this;

        that.grpid = 0;
        that.grpname = "";
        that.onrid = 0;
        that.onrname = "";
        that.employeeList = [];
        that.ownershipList = [];
    }

    // Save Data

    saveGroupOwnership() {
        var that = this;

        if (that.enttid == 0) {
            that._msg.Show(messageType.error, "Error", "Select Entity");
            $(".enttid").focus();
        }
        else if (that.grpid == 0) {
            that._msg.Show(messageType.error, "Error", "Enter Group Name");
            $(".grpname").focus();
        }
        else if (that.employeeList.length == 0) {
            that._msg.Show(messageType.error, "Error", "Enter atleast 1 Ownership");
            $(".onrname input").focus();
        }
        else {
            commonfun.loader();

            var saveogm = {
                "ogmdata": that.ownershipList
            }

            this._ogmservice.saveOwnerTeamMap(saveogm).subscribe(data => {
                try {
                    var dataResult = data.data[0].funsave_onrgroupmap;
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

    getTeamOwnership() {
        var that = this;
        commonfun.loader("#divGroup");

        that._ogmservice.getOwnerTeamMap({
            "flag": "edit",
            "enttid": that.enttid,
            "grpid": that.grpid,
            "wsautoid": that._wsdetails.wsautoid
        }).subscribe(data => {
            try {
                that.ownershipList = data.data;
            }
            catch (e) {
                that._msg.Show(messageType.error, "Error", e);
            }

            commonfun.loaderhide("#divGroup");
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
            console.log(err);
            commonfun.loaderhide("#divGroup");
        }, () => {

        })
    }
}
