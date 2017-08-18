import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { NotificationService } from '@services/master';
import { LazyLoadEvent } from 'primeng/primeng';
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Component({
    templateUrl: 'viewntf.comp.html',
    providers: [CommonService]
})

export class ViewNotificationComponent implements OnInit {
    loginUser: LoginUserModel;
    _wsdetails: any = [];
    _enttdetails: any = [];

    employeeDT: any = [];
    empid: number = 0;
    empname: any = [];
    
    notificationDT: any = [];

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService,
        private _loginservice: LoginService, private _autoservice: CommonService, private _ntfservice: NotificationService) {
        this.loginUser = this._loginservice.getUser();
        this._wsdetails = Globals.getWSDetails();
        this._enttdetails = Globals.getEntityDetails();

        this.viewNotificationRights();
    }

    public ngOnInit() {

    }

    // Auto Completed Employee

    getEmployeeData(event) {
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
            this.employeeDT = data.data;
        }, err => {
            this._msg.Show(messageType.error, "Error", err);
        }, () => {

        });
    }

    // Selected Employee

    selectEmployeeData(event) {
        this.empid = event.value;

        Cookie.set("_empid_", event.value);
        Cookie.set("_empname_", event.label);

        this.getNotification();
    }

    // Notification

    public viewNotificationRights() {
        var that = this;

        if (Cookie.get('_empname_') != null) {
            that.empid = parseInt(Cookie.get('_empid_'));
            that.empname.value = parseInt(Cookie.get('_empid_'));
            that.empname.label = Cookie.get('_empname_');

            that.getNotification();
        }
    }

    getNotification() {
        var that = this;
        commonfun.loader();

        that._ntfservice.getNotification({
            "flag": "all", "wsautoid": that._wsdetails.wsautoid, "enttid": that._enttdetails.enttid, "empid": that.empid
        }).subscribe(data => {
            try {
                that.notificationDT = data.data;
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

    public addNotification() {
        this._router.navigate(['/transaction/notification/add']);
    }

    public editNotification(row) {
        this._router.navigate(['/transaction/notification/edit', row.ntfid]);
    }
}
