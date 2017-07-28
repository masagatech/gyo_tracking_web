import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { TaskAllocateService } from '@services/master';
import { Cookie } from 'ng2-cookies/ng2-cookies';

declare var google: any;

@Component({
    templateUrl: 'addtask.comp.html',
    providers: [CommonService]
})

export class AddTaskAllocateComponent implements OnInit {
    loginUser: LoginUserModel;

    tskid: number = 0;

    entityDT: any = [];
    enttid: number = 0;
    enttname: string = "";

    employeeDT: any = [];
    employeeList: any = [];
    empid: number = 0;
    empname: string = "";

    tsktitle: string = "";
    tskdesc: string = "";
    frmdt: any = "";
    todt: any = "";

    ntrgrpDT: any = [];
    ntrgrp: string = "";

    remark: string = "";

    _wsdetails: any = [];
    private subscribeParameters: any;

    constructor(private _atservice: TaskAllocateService, private _routeParams: ActivatedRoute, private _router: Router,
        private _loginservice: LoginService, private _msg: MessageService, private _autoservice: CommonService) {
        this.loginUser = this._loginservice.getUser();
        this._wsdetails = Globals.getWSDetails();

        this.fillNatureOfGroupDDL();
    }

    public ngOnInit() {
        setTimeout(function () {
            $(".enttname input").focus();
        }, 100);

        this.getTaskAllocate();
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
                "empid": that.empid, "empname": that.empname
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


    // Get Allocate Task

    fillNatureOfGroupDDL() {
        var that = this;
        commonfun.loader();

        that._atservice.getTaskAllocate({ "flag": "dropdown" }).subscribe(data => {
            try {
                that.ntrgrpDT = data.data;
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

    // Clear Fields

    resetTaskFields() {
        var that = this;

        that.tsktitle = "";
        that.tskdesc = "";
        that.frmdt = "";
        that.todt = "";
        that.ntrgrp = "";
        that.remark = "";
        that.empid = 0;
        that.empname = "";
        that.employeeList = [];
    }

    // Save Data

    saveTaskAllocate() {
        var that = this;

        if (that.enttid == 0) {
            that._msg.Show(messageType.error, "Error", "Select Entity");
            $(".enttname input").focus();
        }
        else if (that.tsktitle == "") {
            that._msg.Show(messageType.error, "Error", "Enter Task Title");
            $(".task").focus();
        }
        else if (that.tskdesc == "") {
            that._msg.Show(messageType.error, "Error", "Enter Task Description");
            $(".task").focus();
        }
        else if (that.frmdt == "") {
            that._msg.Show(messageType.error, "Error", "Enter From Time");
            $(".frmdt").focus();
        }
        else if (that.todt == "") {
            that._msg.Show(messageType.error, "Error", "Enter To Time");
            $(".todt").focus();
        }
        else if (that.ntrgrp == "") {
            that._msg.Show(messageType.error, "Error", "Select Nature Of Group");
            $(".ntrgrp").focus();
        }
        else {
            commonfun.loader();

            var selectedEmployee: string[] = [];
            selectedEmployee = Object.keys(that.employeeList).map(function (k) { return that.employeeList[k].empid });

            var saveemp = {
                "tskid": that.tskid,
                "enttid": that.enttid,
                "empid": selectedEmployee,
                "tsktitle": that.tsktitle,
                "tskdesc": that.tskdesc,
                "frmdt": that.frmdt,
                "todt": that.todt,
                "ntrgrp": that.ntrgrp,
                "remark": that.remark,
                "cuid": that.loginUser.ucode,
                "wsautoid": that._wsdetails.wsautoid
            }

            this._atservice.saveTaskAllocate(saveemp).subscribe(data => {
                try {
                    var dataResult = data.data[0].funsave_allocatetask;
                    var msg = dataResult.msg;
                    var msgid = dataResult.msgid;

                    if (msgid != "-1") {
                        that._msg.Show(messageType.success, "Success", msg);

                        if (msgid === "1") {
                            that.resetTaskFields();
                        }
                        else {
                            that.backViewData();
                        }
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

    // Get Allocate Task

    getTaskAllocate() {
        var that = this;
        commonfun.loader();

        that.subscribeParameters = that._routeParams.params.subscribe(params => {
            if (params['id'] !== undefined) {
                that.tskid = params['id'];

                that._atservice.getTaskAllocate({
                    "flag": "edit",
                    "tskid": that.tskid,
                    "wsautoid": that._wsdetails.wsautoid
                }).subscribe(data => {
                    try {
                        console.log(data.data);

                        that.tskid = data.data[0].tskid;
                        that.enttid = data.data[0].enttid;
                        that.enttname = data.data[0].enttname;
                        that.employeeList = data.data[0].empdata;
                        that.tsktitle = data.data[0].tsktitle;
                        that.tskdesc = data.data[0].tskdesc;
                        that.frmdt = data.data[0].frmdt;
                        that.todt = data.data[0].todt;
                        that.ntrgrp = data.data[0].ntrgrp;
                        that.remark = data.data[0].remark;
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
            else {
                if (Cookie.get('_enttnm_') != null) {
                    that.enttid = parseInt(Cookie.get('_enttid_'));
                    that.enttname = Cookie.get('_enttnm_');
                }

                that.resetTaskFields();
                commonfun.loaderhide();
            }
        });
    }

    // Back For View Data

    backViewData() {
        this._router.navigate(['/master/taskallocate']);
    }
}
