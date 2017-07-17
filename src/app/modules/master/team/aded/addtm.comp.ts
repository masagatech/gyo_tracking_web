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

    grpid: number = 0;
    grpnm: string = "";
    purpose: string = "";
    remark: string = "";

    mode: string = "";
    isactive: boolean = true;

    private subscribeParameters: any;

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService, private _loginservice: LoginService,
        private _tmservice: TeamService, private _autoservice: CommonService) 
        {
        this.loginUser = this._loginservice.getUser();
        this._wsdetails = Globals.getWSDetails();
        }

    public ngOnInit() {
        setTimeout(function () {
            $(".frmdt").focus();
        }, 100);

        this.getTeamDetails();
    }

    // Clear Fields

    resetTeamFields() {
        this.grpid = 0;
        this.grpnm = "";
        this.purpose = "";
        this.remark = "";
    }

    // Save Data

    saveTeamInfo() {
        var that = this;

        if (that.grpnm == "") {
            that._msg.Show(messageType.error, "Error", "Enter Team Title");
            $(".grpnm").focus();
        }
        else if (that.purpose == "") {
            that._msg.Show(messageType.error, "Error", "Enter Purpose");
            $(".enttname input").focus();
        }
        else {
            commonfun.loader();

            var saveTeam = {
                "grpid": that.grpid,
                "grpnm": that.grpnm,
                "purpose": that.purpose,
                "cuid": that.loginUser.ucode,
                "wsautoid": that._wsdetails.wsautoid,
                "isactive": that.isactive,
                "mode": ""
            }

            that._tmservice.saveTeamInfo(saveTeam).subscribe(data => {
                try {
                    var dataResult = data.data;
                    var msg = dataResult[0].funsave_Teaminfo.msg;
                    var msgid = dataResult[0].funsave_Teaminfo.msgid;

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
                that.grpid = params['id'];

                params = {
                    "flag": "edit",
                    "grpid": that.grpid,
                    "wsautoid": that._wsdetails.wsautoid
                }

                that._tmservice.getTeamDetails(params).subscribe(data => {
                    try {
                        that.grpid = data.data[0].grpid;
                        that.grpnm = data.data[0].grpnm;
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
        this._router.navigate(['/master/Team']);
    }
}