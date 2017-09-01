import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
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

    currdate: any = "";
    currtime: any = "";
    frmdt: any = "";
    frmtm: any = "";
    todt: any = "";
    totm: any = "";
    leavetypeDT: string = "";
    restype: string = "";
    reason: string = "";

    mode: string = "";
    isactive: boolean = true;

    countlvdays: number = 0;

    private subscribeParameters: any;

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService, private _loginservice: LoginService,
        private _emplvservice: EmployeeLeaveService, private _autoservice: CommonService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.setAppliedLVDate();
        this.fillLeaveTypeDropDown();
    }

    public ngOnInit() {
        var that = this;

        setTimeout(function () {
            $(".empname input").focus();
        }, 100);

        that.getEmployeeLeave();
    }

    // Format Date Time

    formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('-');
    }

    formatTime(date) {
        var d = new Date(date),
        h = '' + d.getHours(),
        m = '' + d.getMinutes();

        if (h.length < 2) h = '0' + h;
        if (m.length < 2) m = '0' + m;

        return h + ':' + m;
    }

    setFromDateAndToDate() {
        var date = new Date();
        var _currdate = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);

        this.currdate = this.formatDate(_currdate);
        this.currtime = this.formatDate(date);

        this.frmdt = this.formatDate(_currdate);
        this.todt = this.formatDate(_currdate);
        
        this.frmtm = this.formatTime(date);
        this.totm = this.formatTime(date);
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
        this.setFromDateAndToDate();
        this.restype = "";
        this.reason = "";
    }

    // Validation For Save

    setAppliedLVDate() {
        var that = this;

        that._emplvservice.getEmployeeLeave({
            "flag": "lvbeforelimit",
            "enttid": that._enttdetails.enttid,
            "wsautoid": that._enttdetails.wsautoid
        }).subscribe(data => {
            if (data.data.length > 0) {
                that.countlvdays = parseInt(data.data[0].val);
            }
            else {
                that.countlvdays = 1;
            }
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
            console.log(err);
            commonfun.loaderhide();
        }, () => {

        })
    }

    isValidationForSave() {
        var that = this;

        var date = new Date();
        var today = that.formatDate(new Date(date.getFullYear(), date.getMonth(), date.getDate()));
        var currtime = this.formatTime(date);
        var lvappldate = that.formatDate(new Date(date.getFullYear(), date.getMonth(), date.getDate() + that.countlvdays));

        if (that.empid == 0) {
            that._msg.Show(messageType.error, "Error", "Enter Employee Name");
            $(".empname input").focus();
            return false;
        }
        else if (that.restype == "") {
            that._msg.Show(messageType.error, "Error", "Enter Leave Type");
            $(".restype").focus();
            return false;
        }
        else if (that.frmdt == "") {
            that._msg.Show(messageType.error, "Error", "Enter From Date");
            $(".frmdt").focus();
            return false;
        }
        else if (today > that.frmdt) {
            that._msg.Show(messageType.error, "Error", "Sholuld Be From Date Greater Than Current Date");
            $(".frmdt").focus();
            return false;
        }
        else if (lvappldate > that.frmdt) {
            that._msg.Show(messageType.error, "Error", "Sholuld Be Leave Date After " + that.countlvdays + " Days");
            $(".frmdt").focus();
            return false;
        }
        else if (that.todt == "") {
            that._msg.Show(messageType.error, "Error", "Enter To Date");
            $(".todt").focus();
            return false;
        }
        else if (today > that.todt) {
            that._msg.Show(messageType.error, "Error", "Sholuld Be To Date Greater Than Current Date");
            $(".todt").focus();
            return false;
        }
        else if (that.frmdt > that.todt) {
            that._msg.Show(messageType.error, "Error", "Sholul Be To Date Greater Than From Date");
            $(".todt").focus();
            return false;
        }
        else if (currtime > that.frmtm) {
            that._msg.Show(messageType.error, "Error", "Sholuld Be From Time Greater Than Current Time");
            $(".frmtm").focus();
            return false;
        }
        else if (that.frmtm > that.totm) {
            that._msg.Show(messageType.error, "Error", "Sholul Be To Time Greater Than From Time");
            $(".totm").focus();
            return false;
        }
        else if (that.reason == "") {
            that._msg.Show(messageType.error, "Error", "Enter Reason");
            $(".reason").focus();
            return false;
        }

        return true;
    }

    // Save Data

    saveEmployeeLeave() {
        var that = this;
        var isvalid = that.isValidationForSave();

        if (isvalid) {
            commonfun.loader();

            var saveEmployeeLeave = {
                "elid": that.elid,
                "enttid": that._enttdetails.enttid,
                "empid": that.empid,
                "frmdt": that.frmdt,
                "frmtm": that.frmtm,
                "todt": that.todt,
                "totm": that.totm,
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
                        that.frmtm = data.data[0].frmtm;
                        that.totm = data.data[0].totm;
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