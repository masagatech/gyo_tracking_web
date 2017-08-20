import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, MenuService, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { HolidayService, TeamEmployeeMapService } from '@services/master';
import { Cookie } from 'ng2-cookies/ng2-cookies';

declare var $: any;
declare var commonfun: any;

@Component({
    templateUrl: 'addhld.comp.html',
    providers: [CommonService]
})

export class AddHolidayComponent implements OnInit {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    hldid: number = 0;
    frmdt: any = "";
    todt: any = "";

    hldcd: string = "";
    hldnm: string = "";
    hlddesc: string = "";

    teamDT: any = [];
    teamList: any = [];
    tmdata: any = [];
    tmid: number = 0;
    tmnm: string = "";

    purpose: string = "";
    remark: string = "";

    mode: string = "";
    isactive: boolean = true;

    private subscribeParameters: any;

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService, private _loginservice: LoginService,
        private _hldservice: HolidayService, private _temservice: TeamEmployeeMapService, private _autoservice: CommonService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();
    }

    public ngOnInit() {
        setTimeout(function () {
            $(".frmdt").focus();
        }, 100);

        this.getHolidayDetails();
    }

    // Auto Completed Team

    getTeamData(event) {
        let query = event.query;

        this._autoservice.getAutoData({
            "flag": "team",
            "uid": this.loginUser.uid,
            "ucode": this.loginUser.ucode,
            "utype": this.loginUser.utype,
            "issysadmin": this.loginUser.issysadmin,
            "wsautoid": this._enttdetails.wsautoid,
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

        this.addTeamList();
        $(".tmnm input").focus();
    }

    // Read Get Team

    addTeamList() {
        var that = this;

        that.teamList.push({
            "tmid": that.tmid, "tmnm": that.tmnm
        });

        that.tmid = 0;
        that.tmnm = "";
        that.tmdata = [];
    }

    deleteTeam(row) {
        this.teamList.splice(this.teamList.indexOf(row), 1);
    }

    // Active / Deactive Data

    active_deactiveHolidayInfo() {
        var that = this;

        var act_deacthld = {
            "hldid": that.hldid,
            "isactive": that.isactive,
            "mode": that.mode
        }

        this._hldservice.saveHoliday(act_deacthld).subscribe(data => {
            try {
                var dataResult = data.data;

                if (dataResult[0].funsave_holiday.msgid != "-1") {
                    that._msg.Show(messageType.success, "Success", dataResult[0].funsave_holiday.msg);
                    that.getHolidayDetails();
                }
                else {
                    that._msg.Show(messageType.error, "Error", dataResult[0].funsave_holiday.msg);
                }
            }
            catch (e) {
                that._msg.Show(messageType.error, "Error", e);
            }
        }, err => {
            console.log(err);
        }, () => {

        });
    }

    // Clear Fields

    resetHolidayFields() {
        this.hldid = 0;
        this.frmdt = "";
        this.todt = "";
        this.hldnm = "";
        this.hlddesc = "";
        this.tmid = 0;
        this.tmnm = "";
        this.teamList = [];
    }

    // Save Data

    saveHolidayInfo() {
        var that = this;

        if (that.frmdt == "") {
            that._msg.Show(messageType.error, "Error", "Enter From Date");
            $(".frmdt").focus();
        }
        else if (that.todt == "") {
            that._msg.Show(messageType.error, "Error", "Enter To Date");
            $(".todt").focus();
        }
        else if (that.hldnm == "") {
            that._msg.Show(messageType.error, "Error", "Enter Holiday Title");
            $(".hldnm").focus();
        }
        else if (that.teamList.length == 0) {
            that._msg.Show(messageType.error, "Error", "Enter Team");
            $(".tmnm input").focus();
        }
        else {
            commonfun.loader();

            var _teamlist: string[] = [];
            _teamlist = Object.keys(that.teamList).map(function (k) { return that.teamList[k].tmid });

            var saveholiday = {
                "hldid": that.hldid,
                "hldcd": that.hldcd,
                "hldnm": that.hldnm,
                "hlddesc": that.hlddesc,
                "tmid": _teamlist,
                "frmdt": that.frmdt,
                "todt": that.todt,
                "enttid": that._enttdetails.enttid,
                "wsautoid": that._enttdetails.wsautoid,
                "cuid": that.loginUser.ucode,
                "isactive": that.isactive,
                "mode": ""
            }

            that._hldservice.saveHoliday(saveholiday).subscribe(data => {
                try {
                    var dataResult = data.data;
                    var msg = dataResult[0].funsave_holiday.msg;
                    var msgid = dataResult[0].funsave_holiday.msgid;

                    if (msgid != "-1") {
                        that._msg.Show(messageType.success, "Success", msg);

                        if (msgid == "1") {
                            that.resetHolidayFields();
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

    // Get Holiday Data

    getHolidayDetails() {
        var that = this;
        commonfun.loader();

        that.subscribeParameters = that._routeParams.params.subscribe(params => {
            if (params['id'] !== undefined) {
                that.hldid = params['id'];

                that._hldservice.getHoliday({
                    "flag": "edit",
                    "id": that.hldid,
                    "wsautoid": that._enttdetails.wsautoid
                }).subscribe(data => {
                    try {
                        that.hldid = data.data[0].hldid;
                        that.hldcd = data.data[0].hldcd;
                        that.hldnm = data.data[0].hldnm;
                        that.hlddesc = data.data[0].hlddesc;
                        that.frmdt = data.data[0].frmdt;
                        that.todt = data.data[0].todt;
                        that.isactive = data.data[0].isactive;
                        that.mode = data.data[0].mode;
                        that.teamList = data.data[0].team !== null ? data.data[0].team : [];
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
                that.resetHolidayFields();
                commonfun.loaderhide();
            }
        });
    }

    // Back For View Data

    backViewData() {
        this._router.navigate(['/master/holiday']);
    }
}