import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { EmployeeLeaveService } from '@services/master';
import { Cookie } from 'ng2-cookies/ng2-cookies';

declare var $: any;
declare var commonfun: any;

@Component({
    templateUrl: 'appremplv.comp.html',
    providers: [CommonService]
})

export class ApprovalEmployeeLeaveComponent implements OnInit, OnDestroy {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    empid: number = 0;
    empname: string = "";

    headertitle: string = "";
    empLeaveDT: any = [];
    empLeaveDetailsDT: any = [];
    selectedlvrow: any = [];

    elid: number = 0;
    frmdt: any = "";
    todt: any = "";
    lvtype: string = "";
    reason: string = "";
    apprremark: string = "";
    status: number = 0;

    private subscribeParameters: any;

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService, private _loginservice: LoginService,
        private _emplvservice: EmployeeLeaveService, private _autoservice: CommonService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.getLeaveEmployee();
    }

    public ngOnInit() {
        setTimeout(function () {
            $(".enttname input").focus();
            commonfun.navistyle();

            $.AdminBSB.islocked = true;
            $.AdminBSB.leftSideBar.Close();
            $.AdminBSB.rightSideBar.activate();
        }, 100);
    }

    // Get Leave Employee

    getLeaveEmployee() {
        var that = this;
        var params = {};

        commonfun.loader();

        that.subscribeParameters = that._routeParams.params.subscribe(params => {
            if (params['empid'] !== undefined) {
                that.empid = params['empid'];

                params = {
                    "flag": "empleave", "empid": that.empid, "uid": that.loginUser.uid, "utype": that.loginUser.utype,
                    "issysadmin": that.loginUser.issysadmin, "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid
                }

                that._emplvservice.getEmployeeLeave(params).subscribe(data => {
                    try {
                        that.empLeaveDT = data.data;
                        that.empname = that.empLeaveDT[0].empname;
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
                commonfun.loaderhide();
            }
        });
    }

    getEmpLeaveDetails(row) {
        var that = this;
        var params = {};

        commonfun.loader();

        that.selectedlvrow = row;
        // that.headertitle = "Voucher No : " + row.expid + " (" + row.countvcr + ")";

        that.subscribeParameters = that._routeParams.params.subscribe(params => {
            if (params['empid'] !== undefined) {
                that.empid = params['empid'];

                params = {
                    "flag": "byemp", "elid": row.elid, "empid": that.empid, "uid": that.loginUser.uid, "utype": that.loginUser.utype,
                    "issysadmin": that.loginUser.issysadmin, "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid
                }

                that._emplvservice.getEmployeeLeave(params).subscribe(data => {
                    try {
                        that.empLeaveDetailsDT = data.data;
                        that.elid = that.empLeaveDetailsDT[0].elid;
                        that.frmdt = that.empLeaveDetailsDT[0].frmdt;
                        that.todt = that.empLeaveDetailsDT[0].todt;
                        that.lvtype = that.empLeaveDetailsDT[0].lvtype;
                        that.reason = that.empLeaveDetailsDT[0].reason;
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
                commonfun.loaderhide();
            }
        });
    }

    // Save Leave Approval

    saveEmployeeLeaveApproval() {
        var that = this;
        var emplvapprdata = {};

        if (that.apprremark == "") {
            that._msg.Show(messageType.info, "Info", "Please Enter Remark");
        }
        else if (that.status == 0) {
            that._msg.Show(messageType.info, "Info", "Please Select Status");
        }
        else {
            commonfun.loader();

            emplvapprdata = {
                "elaid": "0",
                "enttid": that._enttdetails.enttid,
                "empid": that.empid,
                "elid": that.elid,
                "lvtype": that.lvtype,
                "apprremark": that.apprremark,
                "status": that.status,
                "cuid": that.loginUser.ucode,
                "wsautoid": that._enttdetails.wsautoid,
                "isactive": true
            }

            that._emplvservice.saveEmployeeLeaveApproval(emplvapprdata).subscribe(data => {
                try {
                    var dataResult = data.data[0].funsave_empleaveapproval;
                    var msg = dataResult.msg;
                    var msgid = dataResult.msgid;

                    if (msgid != "-1") {
                        that._msg.Show(messageType.success, "Success", msg);
                        
                        that.getLeaveEmployee();
                        that.resetEmpLeaveApproval();

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

    resetEmpLeaveApproval() {
        this.empLeaveDetailsDT = [];
        this.apprremark = "";
        this.status = 0;
    }

    // Back For View Data

    backViewData() {
        this._router.navigate(['/master/employeeleave/pending']);
    }

    public ngOnDestroy() {
        $.AdminBSB.islocked = false;
        $.AdminBSB.leftSideBar.Open();
    }
}