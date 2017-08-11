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
    _wsdetails: any = [];
    _enttdetails: any = [];
    
    statusid: number = 0;
    statusnm: string = "";
    ordno: number = 0;
    remark: string = "";

    mode: string = "";
    isactive: boolean = true;

    private subscribeParameters: any;

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService, private _loginservice: LoginService,
        private _autoservice: CommonService) {
        this.loginUser = this._loginservice.getUser();
        this._wsdetails = Globals.getWSDetails();
        this._enttdetails = Globals.getEntityDetails();
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
        this.ordno = 0;
        this.remark = "";
    }

    // Save Data

    saveStatusInfo() {
        var that = this;

        if (that.statusnm == "") {
            that._msg.Show(messageType.error, "Error", "Enter Status Title");
            $(".statusnm").focus();
        }
        else if (that.ordno == 0) {
            that._msg.Show(messageType.error, "Error", "Enter Order No");
            $(".ordno input").focus();
        }
        else {
            commonfun.loader();

            var saveStatus = {
                "autoid": that.statusid,
                "key": that.statusnm,
                "val": that.statusnm,
                "ordno": that.ordno,
                "group": "taskstatus",
                "cuid": that.loginUser.ucode,
                "enttid": that._enttdetails.enttid,
                "wsautoid": that._wsdetails.wsautoid,
                "isactive": that.isactive,
                "mode": ""
            }

            this._autoservice.saveMOM(saveStatus).subscribe(data => {
                try {
                    var dataResult = data.data[0].funsave_mom;
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
                    "flag": "id",
                    "group": "taskstatus",
                    "id": that.statusid,
                    "wsautoid": that._wsdetails.wsautoid
                }

                that._autoservice.getMOM(params).subscribe(data => {
                    try {
                        that.statusid = data.data[0].autoid;
                        that.statusnm = data.data[0].val;
                        that.ordno = data.data[0].ordno;
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