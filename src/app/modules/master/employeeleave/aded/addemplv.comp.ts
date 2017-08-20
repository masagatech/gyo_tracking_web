import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, MenuService, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { EmployeeLeaveService } from '@services/master';
import { Cookie } from 'ng2-cookies/ng2-cookies';

declare var $: any;
declare var commonfun: any;

@Component({
    templateUrl: 'addemplv.comp.html',
    providers: [CommonService]
})

export class AddEmployeeLeaveComponent implements OnInit {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    elid: number = 0;
    
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
        private _emplvservice: EmployeeLeaveService, private _autoservice: CommonService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.fillLeaveTypeDropDown();
    }

    public ngOnInit() {
        setTimeout(function () {
            $(".frmdt").focus();
        }, 100);

        this.getEmployeeLeave();
    }

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
    }

    // Leave Type

    fillLeaveTypeDropDown() {
        var that = this;
        commonfun.loader();

        that._emplvservice.getEmployeeLeave({ "flag": "dropdown" }).subscribe(data => {
            that.leavetypeDT = data.data;
            // setTimeout(function () { $.AdminBSB.select.refresh('restype'); }, 100);
            commonfun.loaderhide();
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
            console.log(err);
            commonfun.loaderhide();
        }, () => {

        })
    }
  // Clear Fields

    resetEmployeeLeaveFields() {
        this.elid = 0;
        this.empname = [];
        this.restype = "";
        this.frmdt = 0;
        this.todt = 0;
        this.reason = "";
    }

    // Save Data

    saveEmployeeLeave() {
        var that = this;

        if (that.empid == 0) {
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

            var saveEmployeeLeave = {
                "elid": that.elid,
                "enttid": that._enttdetails.enttid,
                "empid": that.empid,
                "frmdt": that.frmdt,
                "todt": that.todt,
                "restype": that.restype,
                "reason": that.reason,
                "cuid": that.loginUser.ucode,
                "wsautoid": that._enttdetails.wsautoid,
                "isactive": that.isactive,
                "mode": ""
            }

            that._emplvservice.saveEmployeeLeave(saveEmployeeLeave).subscribe(data => {
                try {
                    var dataResult = data.data[0].funsave_employeeleave;
                    var msg = dataResult.msg;
                    var msgid = dataResult.msgid;

                    if (msgid != "-1") {
                        that._msg.Show(messageType.success, "Success", msg);

                        if (msgid == "1") {
                            that.resetEmployeeLeaveFields();
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

    getEmployeeLeave() {
        var that = this;
        var params = {};

        commonfun.loader();

        that.subscribeParameters = that._routeParams.params.subscribe(params => {
            if (params['id'] !== undefined) {
                that.elid = params['id'];

                params = {
                    "flag": "edit",
                    "id": that.elid,
                    "wsautoid": that._enttdetails.wsautoid
                }

                that._emplvservice.getEmployeeLeave(params).subscribe(data => {
                    try {
                        that.elid = data.data[0].elid;
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
                that.resetEmployeeLeaveFields();
                commonfun.loaderhide();
            }
        });
    }

    // Back For View Data

    backViewData() {
        this._router.navigate(['/master/employeeleave']);
    }
}