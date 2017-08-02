import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, MenuService, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { LeaveEmployeeService } from '@services/master';
import { Cookie } from 'ng2-cookies/ng2-cookies';

declare var $: any;
declare var commonfun: any;

@Component({
    templateUrl: 'addlvemp.comp.html',
    providers: [CommonService]
})

export class AddLeaveEmployeeComponent implements OnInit {
    loginUser: LoginUserModel;
    _wsdetails: any = [];

    elid: number = 0;
    entityDT: any = [];
    enttid: number = 0;
    enttname: any = [];

    employeeDT: any = [];
    empid: number = 0;
    empname: any = [];

    frmdt: number = 0;
    todt: number = 0;
    leavetypeDT: string = "";
    restype: string = "";
    reason: string = "";

    mode: string = "";
    isactive: boolean = true;

    private subscribeParameters: any;

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService, private _loginservice: LoginService,
        private _lvservice: LeaveEmployeeService, private _autoservice: CommonService) {
        this.loginUser = this._loginservice.getUser();
        this._wsdetails = Globals.getWSDetails();

        this.fillLeaveTypeDropDown();
    }

    public ngOnInit() {
        setTimeout(function () {
            $(".frmdt").focus();
        }, 100);

        this.getLeaveEmployee();
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
        
        Cookie.set("_enttid_", event.value);
        Cookie.set("_enttnm_", event.label);
    }

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
    }

    // Leave Type

    fillLeaveTypeDropDown() {
        var that = this;
        commonfun.loader();

        that._lvservice.getLeaveEmployee({ "flag": "dropdown" }).subscribe(data => {
            that.leavetypeDT = data.data;
            setTimeout(function () { $.AdminBSB.select.refresh('restype'); }, 100);
            commonfun.loaderhide();
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
            console.log(err);
            commonfun.loaderhide();
        }, () => {

        })
    }
  // Clear Fields

    resetLeaveEmployeeFields() {
        this.elid = 0;
        this.empname = [];
        this.restype = "";
        this.frmdt = 0;
        this.todt = 0;
        this.reason = "";
    }

    // Save Data

    saveLeaveEmployee() {
        var that = this;

        if (that.enttid == 0) {
            that._msg.Show(messageType.error, "Error", "Enter Entity Name");
            $(".enttname input").focus();
        }
        else if (that.empid == 0) {
            that._msg.Show(messageType.error, "Error", "Enter Employee Name");
            $(".empname input").focus();
        }
        else if (that.restype == "") {
            that._msg.Show(messageType.error, "Error", "Enter Leave Type");
            $(".restype").focus();
        }
        else if (that.reason == "") {
            that._msg.Show(messageType.error, "Error", "Enter Reason");
            $(".reason input").focus();
        }
        else {
            commonfun.loader();

            var saveLeaveEmployee = {
                "elid": that.elid,
                "enttid": that.enttid,
                "empid": that.empid,
                "frmdt": that.frmdt,
                "todt": that.todt,
                "restype": that.restype,
                "reason": that.reason,
                "cuid": that.loginUser.ucode,
                "wsautoid": that._wsdetails.wsautoid,
                "isactive": that.isactive,
                "mode": ""
            }

            that._lvservice.saveLeaveEmployee(saveLeaveEmployee).subscribe(data => {
                try {
                    var dataResult = data.data[0].funsave_employeeleave;
                    var msg = dataResult.msg;
                    var msgid = dataResult.msgid;

                    if (msgid != "-1") {
                        that._msg.Show(messageType.success, "Success", msg);

                        if (msgid == "1") {
                            that.resetLeaveEmployeeFields();
                        }
                        else {
                            that.backViewData();
                        }

                        commonfun.loaderhide();
                    }
                    else {
                        that._msg.Show(messageType.error, "Error", msg);
                        commonfun.loaderhide();
                    }
                }
                catch (e) {
                    that._msg.Show(messageType.error, "Error", e);
                }
            }, err => {
                that._msg.Show(messageType.error, "Error", err);
                console.log(err);
                commonfun.loaderhide();
            }, () => {
            });
        }
    }

    // Get Tag Data

    getLeaveEmployee() {
        var that = this;
        var params = {};

        commonfun.loader();

        that.subscribeParameters = that._routeParams.params.subscribe(params => {
            if (params['id'] !== undefined) {
                that.elid = params['id'];

                params = {
                    "flag": "edit",
                    "id": that.elid,
                    "wsautoid": that._wsdetails.wsautoid
                }

                that._lvservice.getLeaveEmployee(params).subscribe(data => {
                    try {
                        that.elid = data.data[0].elid;
                        that.enttid = data.data[0].enttid;
                        that.enttname.value = data.data[0].enttid;
                        that.enttname.label = data.data[0].enttname;
                        that.empid = data.data[0].empid;
                        that.empname.value = data.data[0].empid;
                        that.empname.label = data.data[0].empname;
                        that.frmdt = data.data[0].frmdt;
                        that.todt = data.data[0].todt;
                        that.restype = data.data[0].restype;
                        that.reason = data.data[0].reason;
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
                that.resetLeaveEmployeeFields();
                commonfun.loaderhide();
            }
        });
    }

    // Back For View Data

    backViewData() {
        this._router.navigate(['/master/leaveemployee']);
    }
}