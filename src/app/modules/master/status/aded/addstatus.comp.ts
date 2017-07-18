import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, MenuService, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { Cookie } from 'ng2-cookies/ng2-cookies';

declare var $: any;
declare var commonfun: any;

@Component({
    templateUrl: 'addstatus.comp.html',
    providers: [CommonService]
})

export class AddStatusComponent implements OnInit {
    loginUser: LoginUserModel;

   entityDT: any = [];
    enttid: number = 0;
    enttname: string = "";

    _wsdetails: any = [];

    statusid: number = 0;
    statusnm: string = "";
    purpose: string = "";
    remark: string = "";

   mode: string = "";
    isactive: boolean = true;

    private subscribeParameters: any;

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService, private _loginservice: LoginService,
     private _autoservice: CommonService) 
        {
        this.loginUser = this._loginservice.getUser();
        this._wsdetails = Globals.getWSDetails();
        }

    public ngOnInit() {
        setTimeout(function () {
            $(".frmdt").focus();
        }, 100);

        this.getStatusDetails();
    }

    // Clear Fields

    resetStatusFields() {
        this.statusid = 0;
        this.statusnm = "";
        this.purpose = "";
        this.remark = "";
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

    // Save Data

    saveStatusInfo() {
        var that = this;

        if (that.statusnm == "") {
            that._msg.Show(messageType.error, "Error", "Enter Status Title");
            $(".statusnm").focus();
        }
        else if (that.purpose == "") {
            that._msg.Show(messageType.error, "Error", "Enter Purpose");
            $(".enttname input").focus();
        }
        else {
            commonfun.loader();

            var saveStatus = {
                "statusid": that.statusid,
                "statusnm": that.statusnm,
                "cuid": that.loginUser.ucode,
                "wsautoid": that._wsdetails.wsautoid,
                "isactive": that.isactive,
                "mode": ""
            }

           this._autoservice.saveMOM(saveStatus).subscribe(data => {
                try {
                    var dataResult = data.data[0].funsave_Statusinfo;
                    var msg = dataResult.msg;
                    var msgid = dataResult.msgid;

                    if (msgid != "-1") {
                        that._msg.Show(messageType.success, "Success", msg);

                        if (msgid == "1") {
                            that.resetStatusFields();
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

    // Get Status Data

    getStatusDetails() {
        var that = this;
        var params = {};

        commonfun.loader();

        that.subscribeParameters = that._routeParams.params.subscribe(params => {
            if (params['id'] !== undefined) {
                that.statusid = params['id'];

                params = {
                    "flag": "edit",
                    "statusid": that.statusid,
                    "wsautoid": that._wsdetails.wsautoid
                }

                that._autoservice.getMOM(params).subscribe(data => {
                    try {
                        that.statusid = data.data[0].statusid;
                        that.statusnm = data.data[0].statusnm;
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
                that.resetStatusFields();
                commonfun.loaderhide();
            }
        });
    }

    // Back For View Data

    backViewData() {
        this._router.navigate(['/master/status']);
    }
}