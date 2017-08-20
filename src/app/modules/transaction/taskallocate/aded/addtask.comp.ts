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
    _enttdetails: any = [];

    tskid: number = 0;

    employeeDT: any = [];
    empdata: any = [];
    employeeList: any = [];
    empid: number = 0;
    empname: string = "";

    tagDT: any = [];
    tagdata: any = [];
    tagList: any = [];
    tagid: number = 0;
    tagname: string = "";

    tsktitle: string = "";
    tskdesc: string = "";
    frmdt: any = "";
    todt: any = "";

    ntrgrpDT: any = [];
    ntrgrp: string = "";

    remark: string = "";

    private subscribeParameters: any;

    constructor(private _atservice: TaskAllocateService, private _routeParams: ActivatedRoute, private _router: Router,
        private _loginservice: LoginService, private _msg: MessageService, private _autoservice: CommonService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.fillNatureOfGroupDDL();
    }

    public ngOnInit() {
        this.getTaskAllocate();
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
            "wsautoid": this._enttdetails.wsautoid,
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
        that.empdata = [];
        $(".empname input").focus();
        commonfun.loaderhide("#divEmployee");
    }

    // Delete Employee

    deleteEmployee(row) {
        this.employeeList.splice(this.employeeList.indexOf(row), 1);
        row.isactive = false;
    }

    // Auto Completed Tag

    getTagData(event) {
        let query = event.query;

        this._autoservice.getAutoData({
            "flag": "tag",
            "uid": this.loginUser.uid,
            "ucode": this.loginUser.ucode,
            "utype": this.loginUser.utype,
            "enttid": this._enttdetails.enttid,
            "issysadmin": this.loginUser.issysadmin,
            "wsautoid": this._enttdetails.wsautoid,
            "search": query
        }).subscribe((data) => {
            this.employeeDT = data.data;
        }, err => {
            this._msg.Show(messageType.error, "Error", err);
        }, () => {

        });
    }

    // Selected Tag

    selectTagData(event) {
        this.tagid = event.value;
        this.tagname = event.label;
        this.addTagList();
    }

    // Check Duplicate Tag

    isDuplicateTag() {
        var that = this;

        for (var i = 0; i < that.tagList.length; i++) {
            var field = that.tagList[i];

            if (field.tagid == this.tagid) {
                this._msg.Show(messageType.error, "Error", "Duplicate Tag not Allowed");
                return true;
            }
        }

        return false;
    }

    // Read Get Tag

    addTagList() {
        var that = this;
        commonfun.loader("#divTag");

        var duplicateTag = that.isDuplicateTag();

        if (!duplicateTag) {
            that.tagList.push({
                "tagid": that.tagid, "tagname": that.tagname
            });
        }

        that.tagid = 0;
        that.tagname = "";
        that.tagdata = [];
        $(".tagname input").focus();
        commonfun.loaderhide("#divTag");
    }

    // Delete Tag

    deleteTag(row) {
        this.tagList.splice(this.tagList.indexOf(row), 1);
        row.isactive = false;
    }

    // Get Allocate Task

    fillNatureOfGroupDDL() {
        var that = this;
        commonfun.loader();

        that._atservice.getTaskAllocate({ "flag": "dropdown" }).subscribe(data => {
            try {
                that.ntrgrpDT = data.data;
                // setTimeout(function () { $.AdminBSB.select.refresh('ntrgrp'); }, 100);
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
        that.empdata = [];
        that.tagid = 0;
        that.tagname = "";
        that.tagdata = [];
        that.employeeList = [];
    }

    // Save Data

    saveTaskAllocate() {
        var that = this;

        if (that.tsktitle == "") {
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

            var selectedTag: string[] = [];
            selectedTag = Object.keys(that.tagList).map(function (k) { return that.tagList[k].tagid });

            var saveemp = {
                "tskid": that.tskid,
                "empid": selectedEmployee,
                "tagid": selectedTag,
                "tsktitle": that.tsktitle,
                "tskdesc": that.tskdesc,
                "frmdt": that.frmdt,
                "todt": that.todt,
                "ntrgrp": that.ntrgrp,
                "remark": that.remark,
                "cuid": that.loginUser.ucode,
                "enttid": that._enttdetails.enttid,
                "wsautoid": that._enttdetails.wsautoid
            }

            this._atservice.saveTaskAllocate(saveemp).subscribe(data => {
                try {
                    var dataResult = data.data[0].funsave_taskallocate;
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

        var _taskdata = [];
        var _empdata = [];
        var _tagdata = [];

        that.subscribeParameters = that._routeParams.params.subscribe(params => {
            if (params['id'] !== undefined) {
                that.tskid = params['id'];

                that._atservice.getTaskAllocate({
                    "flag": "edit", "tskid": that.tskid, "uid": that.loginUser.uid, "utype": that.loginUser.utype,
                    "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid, "issysadmin": that.loginUser.issysadmin
                }).subscribe(data => {
                    try {
                        _taskdata = data.data[0]._taskdata;

                        that.tskid = _taskdata[0].tskid;
                        that.tsktitle = _taskdata[0].tsktitle;
                        that.tskdesc = _taskdata[0].tskdesc;
                        that.frmdt = _taskdata[0].frmdt;
                        that.todt = _taskdata[0].todt;
                        that.ntrgrp = _taskdata[0].ntrgrp;
                        that.remark = _taskdata[0].remark;

                        _empdata = data.data[0]._empdata == null ? [] : data.data[0]._empdata;
                        _tagdata = data.data[0]._tagdata == null ? [] : data.data[0]._tagdata;

                        that.employeeList = _empdata;
                        that.tagList = _tagdata;
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
                that.resetTaskFields();
                commonfun.loaderhide();
            }
        });
    }

    // Back For View Data

    backViewData() {
        this._router.navigate(['/transaction/taskallocate']);
    }
}
