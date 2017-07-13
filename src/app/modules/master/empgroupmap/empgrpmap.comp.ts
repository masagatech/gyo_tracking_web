import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { EmpGroupMapService } from '@services/master';
import { Cookie } from 'ng2-cookies/ng2-cookies';

declare var google: any;

@Component({
    templateUrl: 'empgrpmap.comp.html',
    providers: [CommonService]
})

export class EmpGroupMapComponent implements OnInit {
    loginUser: LoginUserModel;

    egmid: number = 0;

    entityDT: any = [];
    enttid: number = 0;
    enttname: string = "";

    employeeDT: any = [];
    employeeList: any = [];
    empid: number = 0;
    empname: string = "";

    groupDT: any = [];
    grpid: number = 0;
    grpname: string = "";

    _wsdetails: any = [];
    private subscribeParameters: any;

    constructor(private _egmservice: EmpGroupMapService, private _routeParams: ActivatedRoute, private _router: Router,
        private _loginservice: LoginService, private _msg: MessageService, private _autoservice: CommonService) {
        this.loginUser = this._loginservice.getUser();
        this._wsdetails = Globals.getWSDetails();
    }

    public ngOnInit() {
        setTimeout(function () {
            $(".enttname input").focus();
        }, 100);

        this.getEmpGroupMap();
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

        this.getEmpGroupMap();
    }

    // Auto Completed Employee

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
                "egmid": that.egmid,
                "enttid": that.enttid, "enttname": that.enttname,
                "grpid": that.grpid, "grpname": that.grpname,
                "empid": that.empid, "empname": that.empname,
                "wsautoid": that._wsdetails.wsautoid, "isactive": true
            });
        }

        that.empid = 0;
        that.empname = "";
        $(".empname input").focus();
        commonfun.loaderhide("#divEmployee");
    }

    // Delete Employee

    deleteEmployee(row) {
        this.employeeList.splice(this.employeeList.indexOf(row), 1);
        row.isactive = false;
    }

    // Clear Fields

    resetEmployeeFields() {
        var that = this;

        that.grpid = 0;
        that.grpname = "";
        that.empid = 0;
        that.empname = "";
        that.employeeList = [];
    }

    // Save Data

    saveEmpGroupMap() {
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
            that._msg.Show(messageType.error, "Error", "Enter atleast 1 Employee");
            $(".empname input").focus();
        }
        else {
            commonfun.loader();

            var saveegm = {
                "egmdata": that.employeeList
            }

            this._egmservice.saveEmpGroupMap(saveegm).subscribe(data => {
                try {
                    var dataResult = data.data[0].funsave_empgroupmap;
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

    getEmpGroupMap() {
        var that = this;
        commonfun.loader("#divGroup");

        that._egmservice.getEmpGroupMap({
            "flag": "edit",
            "enttid": that.enttid,
            "grpid": that.grpid,
            "wsautoid": that._wsdetails.wsautoid
        }).subscribe(data => {
            try {
                that.employeeList = data.data;
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
