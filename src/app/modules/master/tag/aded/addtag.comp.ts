import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, MenuService, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { TagService } from '@services/master';
import { Cookie } from 'ng2-cookies/ng2-cookies';

declare var $: any;
declare var commonfun: any;

@Component({
    templateUrl: 'addtag.comp.html',
    providers: [CommonService]
})

export class AddTagComponent implements OnInit {
    loginUser: LoginUserModel;
    _wsdetails: any = [];

    entityDT: any = [];
    enttid: number = 0;
    enttname: any = [];

    tagid: number = 0;
    tagnm: string = "";
    remark1: string = "";
    remark2: string = "";
    remark3: string = "";

    mode: string = "";
    isactive: boolean = true;

    private subscribeParameters: any;

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService, private _loginservice: LoginService,
        private _tagservice: TagService, private _autoservice: CommonService) {
        this.loginUser = this._loginservice.getUser();
        this._wsdetails = Globals.getWSDetails();
    }

    public ngOnInit() {
        setTimeout(function () {
            $(".frmdt").focus();
        }, 100);

        this.getTagDetails();
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

    resetTagFields() {
        this.tagid = 0;
        this.tagnm = "";
        this.remark1 = "";
        this.remark2 = "";
        this.remark3 = "";
    }

    // Save Data

    saveTagInfo() {
        var that = this;

        if (that.enttid == 0) {
            that._msg.Show(messageType.error, "Error", "Enter Entity Name");
            $(".enttname input").focus();
        }
        else if (that.tagnm == "") {
            that._msg.Show(messageType.error, "Error", "Enter Tag Name");
            $(".tagnm").focus();
        }
        else if (that.remark1 == "") {
            that._msg.Show(messageType.error, "Error", "Enter Remark");
            $(".enttname input").focus();
        }
        else {
            commonfun.loader();

            var saveTag = {
                "tagid": that.tagid,
                "tagnm": that.tagnm,
                "tagtype": "p",
                "enttid": that.enttid,
                "remark1": that.remark1,
                "remark2": that.remark2,
                "remark3": that.remark3,
                "cuid": that.loginUser.ucode,
                "wsautoid": that._wsdetails.wsautoid,
                "isactive": that.isactive,
                "mode": ""
            }

            that._tagservice.saveTagInfo(saveTag).subscribe(data => {
                try {
                    var dataResult = data.data[0].funsave_taginfo;
                    var msg = dataResult.msg;
                    var msgid = dataResult.msgid;

                    if (msgid != "-1") {
                        that._msg.Show(messageType.success, "Success", msg);

                        if (msgid == "1") {
                            that.resetTagFields();
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

    getTagDetails() {
        var that = this;
        var params = {};

        commonfun.loader();

        that.subscribeParameters = that._routeParams.params.subscribe(params => {
            if (params['id'] !== undefined) {
                that.tagid = params['id'];

                params = {
                    "flag": "edit",
                    "tagid": that.tagid,
                    "wsautoid": that._wsdetails.wsautoid
                }

                that._tagservice.getTagDetails(params).subscribe(data => {
                    try {
                        that.tagid = data.data[0].tagid;
                        that.tagnm = data.data[0].tagnm;
                        that.enttid = data.data[0].enttid;
                        that.enttname.value = data.data[0].enttid;
                        that.enttname.label = data.data[0].enttname;
                        that.remark1 = data.data[0].remark1;
                        that.remark2 = data.data[0].remark2;
                        that.remark3 = data.data[0].remark3;
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
                that.resetTagFields();
                commonfun.loaderhide();
            }
        });
    }

    // Back For View Data

    backViewData() {
        this._router.navigate(['/master/tag']);
    }
}