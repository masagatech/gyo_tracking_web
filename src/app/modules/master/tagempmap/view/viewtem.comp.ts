import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { TagService } from '@services/master';
import { LazyLoadEvent } from 'primeng/primeng';
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Component({
    templateUrl: 'viewtem.comp.html',
    providers: [CommonService]
})

export class ViewTagEmployeeMapComponent implements OnInit {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    headertitle: string = "";

    emptagDT: any = [];
    tagempDT: any = [];
    totCountTags: number = 0;

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService,
        private _loginservice: LoginService, private _autoservice: CommonService, private _ptservice: TagService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.getCountEmpTags();
    }

    public ngOnInit() {

    }

    getCountEmpTags() {
        var that = this;
        commonfun.loader();

        that.totCountTags = 0;

        that._ptservice.getTagEmployeeMap({
            "flag": "empwisetag", "uid": that.loginUser.uid, "utype": that.loginUser.utype, "enttid": that._enttdetails.enttid,
            "wsautoid": that._enttdetails.wsautoid, "issysadmin": that.loginUser.issysadmin
        }).subscribe(data => {
            try {
                that.emptagDT = data.data;

                let totCountTags = Object.keys(that.emptagDT).map(function (k) {
                    that.totCountTags += parseInt(that.emptagDT[k].counttag);
                })
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

    getTagEmployeeMap(_empid) {
        var that = this;
        commonfun.loader("#msttag");

        that._ptservice.getTagEmployeeMap({
            "flag": "tagwiseemp", "uid": that.loginUser.uid, "utype": that.loginUser.utype, "enttid": that._enttdetails.enttid,
            "wsautoid": that._enttdetails.wsautoid, "issysadmin": that.loginUser.issysadmin, "empid": _empid
        }).subscribe(data => {
            try {
                if (data.data.length > 0) {
                    that.tagempDT = data.data;
                    that.headertitle = data.data[0].empname;
                }
                else {
                    that.tagempDT = [];
                    that.headertitle = "";
                }
            }
            catch (e) {
                that._msg.Show(messageType.error, "Error", e);
            }

            commonfun.loaderhide("#msttag");
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
            console.log(err);
            commonfun.loaderhide("#msttag");
        }, () => {

        })
    }

    public addTagEmployeeMap() {
        this._router.navigate(['/master/tagempmap/add']);
    }

    public editTagEmployeeMap(row) {
        this._router.navigate(['/master/tagempmap/edit', row.tagid]);
    }
}
