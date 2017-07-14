import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { AllocateTaskService } from '@services/master';
import { Cookie } from 'ng2-cookies/ng2-cookies';

declare var google: any;

@Component({
    templateUrl: 'addtask.comp.html',
    providers: [CommonService]
})

export class AddAllocateTaskComponent implements OnInit {
    loginUser: LoginUserModel;

    tskid: number = 0;

    entityDT: any = [];
    enttid: number = 0;
    enttname: string = "";

    employeeDT: any = [];
    empid: number = 0;
    empname: string = "";

    task: string = "";
    frmdt: any = "";
    todt: any = "";

    ntrgrpDT: any = [];
    ntrgrp: string = "";

    remark: string = "";

    _wsdetails: any = [];
    private subscribeParameters: any;

    constructor(private _tskservice: AllocateTaskService, private _routeParams: ActivatedRoute, private _router: Router,
        private _loginservice: LoginService, private _msg: MessageService, private _autoservice: CommonService) {
        this.loginUser = this._loginservice.getUser();
        this._wsdetails = Globals.getWSDetails();

        this.fillNatureOfGroupDDL();
    }

    public ngOnInit() {
        setTimeout(function () {
            $(".enttname input").focus();
        }, 100);

        this.getAllocateTask();
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
    }

    // Get Allocate Task

    fillNatureOfGroupDDL() {
        var that = this;
        commonfun.loader();

        that._tskservice.getAllocateTask({ "flag": "dropdown" }).subscribe(data => {
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

    resetEmployeeFields() {
        var that = this;

        that.empid = 0;
        that.empname = "";
        that.task = "";
        that.frmdt = "";
        that.todt = "";
        that.ntrgrp = "";
        that.remark = "";
    }

    // Save Data

    saveAllocateTask() {
        var that = this;

        if (that.enttid == 0) {
            that._msg.Show(messageType.error, "Error", "Select Entity");
            $(".enttname input").focus();
        }
        else if (that.empid == 0) {
            that._msg.Show(messageType.error, "Error", "Enter Employee");
            $(".empname input").focus();
        }
        else if (that.task == "") {
            that._msg.Show(messageType.error, "Error", "Enter Task");
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

            var saveemp = {
                "tskid": that.tskid,
                "enttid": that.enttid,
                "empid": that.empid,
                "task": that.task,
                "frmdt": that.frmdt,
                "todt": that.todt,
                "ntrgrp": that.ntrgrp,
                "remark": that.remark,
                "cuid": that.loginUser.ucode,
                "wsautoid": that._wsdetails.wsautoid
            }

            this._tskservice.saveAllocateTask(saveemp).subscribe(data => {
                try {
                    var dataResult = data.data[0].funsave_allocatetask;
                    var msg = dataResult.msg;
                    var msgid = dataResult.msgid;

                    if (msgid != "-1") {
                        that._msg.Show(messageType.success, "Success", msg);

                        if (msgid === "1") {
                            that.resetEmployeeFields();
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

    getAllocateTask() {
        var that = this;
        commonfun.loader();

        that.subscribeParameters = that._routeParams.params.subscribe(params => {
            if (params['id'] !== undefined) {
                that.empid = params['id'];

                that._tskservice.getAllocateTask({
                    "flag": "edit",
                    "tskid": that.empid,
                    "wsautoid": that._wsdetails.wsautoid
                }).subscribe(data => {
                    try {
                        that.tskid = data.data[0].tskid;
                        that.enttid = data.data[0].enttid;
                        that.enttname = data.data[0].enttname;
                        that.empid = data.data[0].empid;
                        that.empname = data.data[0].empname;
                        that.task = data.data[0].task;
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

                that.resetEmployeeFields();
                commonfun.loaderhide();
            }
        });
    }

    // Back For View Data

    backViewData() {
        this._router.navigate(['/master/allocatetask']);
    }
}
