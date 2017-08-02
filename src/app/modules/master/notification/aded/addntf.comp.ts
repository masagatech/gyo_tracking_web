import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { TeamEmployeeMapService, NotificationService } from '@services/master';
import { Cookie } from 'ng2-cookies/ng2-cookies';

declare var google: any;

@Component({
    templateUrl: 'addntf.comp.html',
    providers: [CommonService]
})

export class AddNotificationComponent implements OnInit {
    loginUser: LoginUserModel;

    ntfid: number = 0;

    entityDT: any = [];
    enttid: number = 0;
    enttname: any = [];

    teamDT: any = [];
    tmid: number = 0;
    tmnm: string = "";

    employeeDT: any = [];
    empid: number = 0;
    empname: any = [];

    employeeList: any = [];

    title: string = "";
    msg: string = "";

    _wsdetails: any = [];
    private subscribeParameters: any;

    constructor(private _temservice: TeamEmployeeMapService, private _ntfservice: NotificationService, private _routeParams: ActivatedRoute,
        private _router: Router, private _loginservice: LoginService, private _msg: MessageService, private _autoservice: CommonService) {
        this.loginUser = this._loginservice.getUser();
        this._wsdetails = Globals.getWSDetails();
    }

    public ngOnInit() {
        setTimeout(function () {
            $(".enttname input").focus();
        }, 100);

        this.getNotification();
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

    // Auto Completed Team

    getTeamData(event) {
        let query = event.query;

        this._autoservice.getAutoData({
            "flag": "team",
            "wsautoid": this._wsdetails.wsautoid,
            "search": query
        }).subscribe((data) => {
            this.teamDT = data.data;
        }, err => {
            this._msg.Show(messageType.error, "Error", err);
        }, () => {

        });
    }

    // Selected Team

    selectTeamData(event) {
        this.tmid = event.value;
        this.tmnm = event.label;
        this.getTeamEmployeeMap();
    }

    // Get Team Employee Data

    getTeamEmployeeMap() {
        var that = this;
        commonfun.loader("#divTeam");

        that._temservice.getTeamEmployeeMap({
            "flag": "edit",
            "enttid": that.enttid,
            "tmid": that.tmid,
            "wsautoid": that._wsdetails.wsautoid
        }).subscribe(data => {
            try {
                if (data.data.length > 0) {
                    that.employeeList = data.data;
                }
                else {
                    that._msg.Show(messageType.error, "Error", "There are no Employee");
                    that.tmid = 0;
                    that.tmnm = "";
                    that.employeeList = [];
                    $(".tmnm input").focus();
                }
            }
            catch (e) {
                that._msg.Show(messageType.error, "Error", e);
            }

            commonfun.loaderhide("#divTeam");
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
            console.log(err);
            commonfun.loaderhide("#divTeam");
        }, () => {

        })
    }

    private selectAndDeselectAllCheckboxes() {
        if ($("#selectall").is(':checked')) {
            $(".allcheckboxes input[type=checkbox]").prop('checked', true);
        }
        else {
            $(".allcheckboxes input[type=checkbox]").prop('checked', false);
        }
    }

    // Clear Fields

    resetNotificationFields() {
        var that = this;

        that.tmid = 0;
        that.tmnm = "";
        that.empid = 0;
        that.empname = "";
        that.title = "";
        that.msg = "";
        that.employeeList = [];
    }

    // Selected Employee

    getSelectedEmployee() {
        var _giverights = [];
        var emplist = null;
        var selemp = "";
        var selemplist = {};

        for (var i = 0; i <= this.employeeList.length - 1; i++) {
            emplist = null;
            emplist = this.employeeList[i];

            if (emplist !== null) {
                $("#emp" + emplist.empid).find("input[type=checkbox]").each(function () {
                    selemp += (this.checked ? $(this).val() + "," : "");
                });

                selemplist = "{" + selemp.slice(0, -1) + "}";
            }
        }

        return selemplist;
    }

    // Save Data

    saveNotification() {
        var that = this;
        var selemplist = {};

        if (that.enttid == 0) {
            that._msg.Show(messageType.error, "Error", "Enter Entity");
            $(".empname input").focus();
        }
        else if (that.tmid == 0) {
            that._msg.Show(messageType.error, "Error", "Enter Team");
            $(".tmnm input").focus();
        }
        else if (that.title == "") {
            that._msg.Show(messageType.error, "Error", "Enter Title");
            $(".title").focus();
        }
        else if (that.msg == "") {
            that._msg.Show(messageType.error, "Error", "Enter Message");
            $(".msg").focus();
        }
        else {
            // _emplist = Object.keys(that.employeeList).map(function (k) { return that.employeeList[k].empid });

            selemplist = that.getSelectedEmployee();
            console.log(selemplist);

            if (selemplist == "{}") {
                that._msg.Show(messageType.error, "Error", "Select Atleast 1 Employee");
                $(".frmtm").focus();
            }
            else {
                commonfun.loader();

                var saveemp = {
                    "ntfid": that.ntfid,
                    "enttid": that.enttid,
                    "tmid": that.tmid,
                    "empid": selemplist,
                    "title": that.title,
                    "msg": that.msg,
                    "cuid": that.loginUser.ucode,
                    "wsautoid": that._wsdetails.wsautoid
                }

                this._ntfservice.saveNotification(saveemp).subscribe(data => {
                    try {
                        var dataResult = data.data[0].funsave_notification;
                        var msg = dataResult.msg;
                        var msgid = dataResult.msgid;

                        if (msgid != "-1") {
                            that._msg.Show(messageType.success, "Success", msg);

                            if (msgid === "1") {
                                that.resetNotificationFields();
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
    }

    // Get Allocate Task

    getNotification() {
        var that = this;
        commonfun.loader();

        that.subscribeParameters = that._routeParams.params.subscribe(params => {
            if (params['id'] !== undefined) {
                that.ntfid = params['id'];

                that._ntfservice.getNotification({
                    "flag": "edit",
                    "ntfid": that.ntfid,
                    "wsautoid": that._wsdetails.wsautoid
                }).subscribe(data => {
                    try {
                        that.ntfid = data.data[0].ntfid;
                        that.enttid = data.data[0].enttid;
                        that.enttname.value = data.data[0].enttid;
                        that.enttname.label = data.data[0].enttname;
                        that.tmid = data.data[0].tmid;
                        that.tmnm = data.data[0].tmnm;
                        // that.employeeList = data.data[0].empdata;
                        that.getTeamEmployeeMap();

                        that.title = data.data[0].title;
                        that.msg = data.data[0].msg;
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
                    that.enttname.value = parseInt(Cookie.get('_enttid_'));
                    that.enttname.label = Cookie.get('_enttnm_');
                }

                that.resetNotificationFields();
                commonfun.loaderhide();
            }
        });
    }

    // Back For View Data

    backViewData() {
        this._router.navigate(['/master/notification']);
    }
}
