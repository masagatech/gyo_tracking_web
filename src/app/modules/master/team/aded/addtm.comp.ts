import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, MenuService, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { TeamService } from '@services/master';
import { Cookie } from 'ng2-cookies/ng2-cookies';

declare var $: any;
declare var commonfun: any;

@Component({
    templateUrl: 'addtm.comp.html',
    providers: [CommonService]
})

export class AddTeamComponent implements OnInit {
    loginUser: LoginUserModel;
    _wsdetails: any = [];

    entityDT: any = [];
    enttid: number = 0;
    enttname: any = [];

    tmid: number = 0;
    tmnm: string = "";
    purpose: string = "";
    remark: string = "";

    mode: string = "";
    isactive: boolean = true;

    private subscribeParameters: any;

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService, private _loginservice: LoginService,
        private _tmservice: TeamService, private _autoservice: CommonService) {
        this.loginUser = this._loginservice.getUser();
        this._wsdetails = Globals.getWSDetails();
    }

    public ngOnInit() {
        setTimeout(function () {
            $(".frmdt").focus();
        }, 100);

        this.getTeamDetails();
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

    // Clear Fields

    resetTeamFields() {
        this.tmid = 0;
        this.tmnm = "";
        this.purpose = "";
        this.remark = "";
    }

    // Save Data

    saveTeamInfo() {
        var that = this;

        if (that.tmnm == "") {
            that._msg.Show(messageType.error, "Error", "Enter Team Title");
            $(".tmnm").focus();
        }
        else if (that.purpose == "") {
            that._msg.Show(messageType.error, "Error", "Enter Purpose");
            $(".enttname input").focus();
        }
        else {
            commonfun.loader();

            var saveTeam = {
                "tmid": that.tmid,
                "tmnm": that.tmnm,
                "purpose": that.purpose,
                "cuid": that.loginUser.ucode,
                "enttid": that.enttid,
                "wsautoid": that._wsdetails.wsautoid,
                "isactive": that.isactive,
                "mode": ""
            }

            that._tmservice.saveTeamInfo(saveTeam).subscribe(data => {
                try {
                    var dataResult = data.data[0].funsave_teaminfo;
                    var msg = dataResult.msg;
                    var msgid = dataResult.msgid;

                    if (msgid != "-1") {
                        that._msg.Show(messageType.success, "Success", msg);

                        if (msgid == "1") {
                            that.resetTeamFields();
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

    // Get Team Data

    getTeamDetails() {
        var that = this;
        var params = {};

        commonfun.loader();

        that.subscribeParameters = that._routeParams.params.subscribe(params => {
            if (params['id'] !== undefined) {
                that.tmid = params['id'];

                params = {
                    "flag": "edit",
                    "tmid": that.tmid,
                    "wsautoid": that._wsdetails.wsautoid
                }

                that._tmservice.getTeamDetails(params).subscribe(data => {
                    try {
                        that.tmid = data.data[0].tmid;
                        that.enttid = data.data[0].enttid;
                        that.enttname.value = data.data[0].enttid;
                        that.enttname.label = data.data[0].enttname;
                        that.tmnm = data.data[0].tmnm;
                        that.purpose = data.data[0].purpose;
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
                that.resetTeamFields();
                commonfun.loaderhide();
            }
        });
    }

    // Back For View Data

    backViewData() {
        this._router.navigate(['/master/team']);
    }
}