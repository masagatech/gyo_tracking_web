import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, messageType, MenuService, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { TaskAllocateService } from '@services/master';
import { LazyLoadEvent } from 'primeng/primeng';
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Component({
    templateUrl: 'rptat.comp.html',
    providers: [MenuService, CommonService]
})

export class TaskAllocateComponent implements OnInit, OnDestroy {
    loginUser: LoginUserModel;
    _wsdetails: any = [];
    _enttdetails: any = [];

    frmdt: any = "";
    todt: any = "";

    assignedbyDT: any = [];
    assbydata: any = [];
    assbyid: number = 0;
    assbyname: string = "";
    assbytype: string = "";

    assignedtoDT: any = [];
    asstodata: any = [];
    asstoid: number = 0;
    asstoname: string = "";

    tagDT: any = [];
    tagdata: any = [];
    tagid: number = 0;
    tagname: string = "";
    taglist: any = [];

    @ViewChild('task') stops: ElementRef;

    allocateTaskDT: any = [];

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService,
        private _loginservice: LoginService, private _autoservice: CommonService, private _atservice: TaskAllocateService) {
        this.loginUser = this._loginservice.getUser();
        this._wsdetails = Globals.getWSDetails();
        this._enttdetails = Globals.getEntityDetails();

        this.setFromDateAndToDate();
        this.getTaskReports();
    }

    public ngOnInit() {
        setTimeout(function () {
            commonfun.navistyle();

            $.AdminBSB.islocked = true;
            $.AdminBSB.leftSideBar.Close();
            $.AdminBSB.rightSideBar.activate();
        }, 0);
    }

    // Selected Calendar Date

    formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('-');
    }

    // Format Date

    setFromDateAndToDate() {
        var date = new Date();
        var before7days = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 7);
        var today = new Date(date.getFullYear(), date.getMonth(), date.getDate());

        this.frmdt = this.formatDate(before7days);
        this.todt = this.formatDate(today);
    }

    // Auto Completed Assigned By

    getAssignedByData(event) {
        var that = this;
        let query = event.query;

        that._autoservice.getAutoData({
            "flag": "users",
            "uid": that.loginUser.uid,
            "ucode": that.loginUser.ucode,
            "utype": that.loginUser.utype,
            "issysadmin": that.loginUser.issysadmin,
            // "wsautoid": that._wsdetails.wsautoid,
            "search": query
        }).subscribe(data => {
            that.assignedbyDT = data.data;
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
        }, () => {

        });
    }

    // Selected Assigned By

    selectAssignedByData(event, arg) {
        var that = this;

        that.assbyid = event.uid;
        that.assbyname = event.uname;
        that.assbytype = event.utype;
    }

    // Auto Completed Assigned To

    getAssignedToData(event) {
        let query = event.query;

        this._autoservice.getAutoData({
            "flag": "employee",
            "uid": this.loginUser.uid,
            "ucode": this.loginUser.ucode,
            "utype": this.loginUser.utype,
            "enttid": this._enttdetails.enttid,
            "issysadmin": this.loginUser.issysadmin,
            "wsautoid": this._wsdetails.wsautoid,
            "search": query
        }).subscribe((data) => {
            this.assignedtoDT = data.data;
        }, err => {
            this._msg.Show(messageType.error, "Error", err);
        }, () => {

        });
    }

    // Selected Assigned To

    selectAssignedToData(event) {
        this.asstoid = event.value;
        this.asstoname = event.label;
    }

    // Auto Completed Tag

    getTagData(event) {
        let query = event.query;

        this._autoservice.getAutoData({
            "flag": "tag",
            "enttid": this._enttdetails.enttid,
            "wsautoid": this._wsdetails.wsautoid,
            "search": query
        }).subscribe((data) => {
            this.tagDT = data.data;
        }, err => {
            this._msg.Show(messageType.error, "Error", err);
        }, () => {

        });
    }

    // Selected Tag

    selectTagData(event) {
        this.tagid = event.value;
        this.tagname = event.label;
        this.getTagList();
    }

    // Get Tag List

    getTagList() {
        this.taglist.push({ "tagid": this.tagid, "tagname": this.tagname });

        this.tagid = 0;
        this.tagname = "";
        this.tagdata = [];
    }

    getTaskReports() {
        var that = this;
        commonfun.loader();

        var tagids = that.taglist.length !== 0 ? that.taglist.map(function (val) { return val.tagid; }).join(',') : "0";

        that._atservice.getTaskReports({
            "flag": "reports", "frmdt": that.frmdt, "todt": that.todt, "assbyid": that.assbyid, "assbytype": that.assbytype, "asstoid": that.asstoid,
            "uid": that.loginUser.uid, "utype": that.loginUser.utype, "tagid": tagids, "tsktitle": "", "enttid": that._enttdetails.enttid,
            "wsautoid": that._wsdetails.wsautoid, "issysadmin": that.loginUser.issysadmin
        }).subscribe(data => {
            try {
                that.allocateTaskDT = data.data;
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

    // Expand Employee Task Updated

    expandTaskNature(row) {
        let that = this;

        if (row.issh == 0) {
            row.issh = 1;

            if (row.tskupdate.length === 0) {
                var params = {
                    "flag": "details", "tskid": row.tskid
                }

                that._atservice.getTaskReports(params).subscribe(data => {
                    row.tskupdate = data.data;

                    for (var i = 0; i < row.tskupdate.length; i++) {
                        if (row.tskupdate[i].issh == 0) {
                            row.tskupdate[i].issh = false;
                        }
                        else {
                            row.tskupdate[i].issh = true;
                        }
                    }
                }, err => {
                    that._msg.Show(messageType.error, "Error", err);
                    console.log(err);
                }, () => {

                })
            }
        } else {
            row.issh = 0;
        }
    }

    public ngOnDestroy() {
        $.AdminBSB.islocked = false;
        $.AdminBSB.leftSideBar.Open();
    }
}
