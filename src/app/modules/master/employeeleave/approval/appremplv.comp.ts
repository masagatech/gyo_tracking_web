import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, MenuService, LoginService, CommonService } from '@services';
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
    status: number = 0;

    pendEmpLeaveDT: any = [];

    private subscribeParameters: any;

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService, private _loginservice: LoginService,
        private _emplvservice: EmployeeLeaveService, private _autoservice: CommonService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.getEmployeeLeaveDetails();
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

    getEmployeeLeaveDetails() {
        var that = this;
        var params = {};

        commonfun.loader();

        that.subscribeParameters = that._routeParams.params.subscribe(params => {
            if (params['empid'] !== undefined) {
                that.empid = params['empid'];

                params = {
                    "flag": "byemp", "empid": that.empid, "uid": that.loginUser.uid, "utype": that.loginUser.utype,
                    "issysadmin": that.loginUser.issysadmin, "enttid": that._enttdetails.enttid,
                    "wsautoid": that._enttdetails.wsautoid
                }

                that._emplvservice.getEmployeeLeave(params).subscribe(data => {
                    try {
                        that.pendEmpLeaveDT = data.data;
                        that.empname = that.pendEmpLeaveDT[0].empname;
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
        var emplvapprdata = [];

        commonfun.loader();

        for (var i = 0; i < that.pendEmpLeaveDT.length; i++) {
            var lvrow = that.pendEmpLeaveDT[i];

            if (lvrow.status !== 0) {
                emplvapprdata.push({
                    "elaid": "0",
                    "enttid": that._enttdetails.enttid,
                    "empid": that.empid,
                    "elid": lvrow.elid,
                    "lvtype": lvrow.lvtype,
                    "apprremark": lvrow.apprremark,
                    "status": lvrow.status,
                    "cuid": that.loginUser.ucode,
                    "wsautoid": that._enttdetails.wsautoid,
                    "isactive": true
                })
            }
        }

        that._emplvservice.saveEmployeeLeaveApproval({ "emplvapprdata": emplvapprdata }).subscribe(data => {
            try {
                var dataResult = data.data[0].funsave_empleaveapproval;
                var msg = dataResult.msg;
                var msgid = dataResult.msgid;

                if (msgid != "-1") {
                    that._msg.Show(messageType.success, "Success", msg);
                    that.getEmployeeLeaveDetails();

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

    // Back For View Data

    backViewData() {
        this._router.navigate(['/master/employeeleave/pending']);
    }

    public ngOnDestroy() {
        $.AdminBSB.islocked = false;
        $.AdminBSB.leftSideBar.Open();
    }
}