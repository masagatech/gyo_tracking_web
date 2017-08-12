import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, messageType, LoginService, MenuService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { UserService } from '@services/master';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { LazyLoadEvent } from 'primeng/primeng';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';
import jsPDF from 'jspdf'

declare var $: any;

@Component({
    templateUrl: 'rptuser.comp.html',
    providers: [CommonService]
})

export class UserReportsComponent implements OnInit, OnDestroy {
    loginUser: LoginUserModel;
    _wsdetails: any = [];
    _enttdetails: any = [];

    entityDT: any = [];
    enttdata: any = [];
    enttid: number = 0;
    enttname: string = "";

    autoUserDT: any = [];

    autouid: number = 0;
    autouname: any = [];

    utypeDT: any = [];
    srcutype: string = "all";

    usersDT: any = [];

    isShowGrid: boolean = true;
    isShowList: boolean = false;

    @ViewChild('users') users: ElementRef;

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService, public _menuservice: MenuService,
        private _autoservice: CommonService, private _loginservice: LoginService, private _userservice: UserService) {
        this.loginUser = this._loginservice.getUser();
        this._wsdetails = Globals.getWSDetails();
        this._enttdetails = Globals.getEntityDetails();

        this.fillUserTypeDropDown();
        this.viewUserDataRights();
    }

    public ngOnInit() {
        var that = this;
        that.refreshButtons();

        setTimeout(function () {
            commonfun.navistyle();

            $.AdminBSB.islocked = true;
            $.AdminBSB.leftSideBar.Close();
            $.AdminBSB.rightSideBar.activate();
        }, 100);
    }

    isshUser(viewtype) {
        var that = this;
        commonfun.loader("#divShow");

        if (viewtype == "grid") {
            that.isShowGrid = true;
            that.isShowList = false;
            commonfun.loaderhide("#divShow");
        }
        else {
            that.isShowGrid = false;
            that.isShowList = true;
            commonfun.loaderhide("#divShow");
        }

        that.refreshButtons();
    }

    refreshButtons() {
        setTimeout(function () {
            commonfun.navistyle();
        }, 0);
    }

    // Export

    public exportToCSV() {
        new Angular2Csv(this.usersDT, 'UserReports', { "showLabels": true });
    }

    public exportToPDF() {
        let pdf = new jsPDF('l', 'pt', 'a4');
        let options = {
            pagesplit: true
        };
        pdf.addHTML(this.users.nativeElement, 0, 0, options, () => {
            pdf.save("UserReports.pdf");
        });
    }

    // Fill Dropdown

    fillUserTypeDropDown() {
        var that = this;
        commonfun.loader();

        that._userservice.getUserDetails({ "flag": "dropdown", "utype": that.loginUser.utype }).subscribe(data => {
            that.utypeDT = data.data;
            // setTimeout(function () { $.AdminBSB.select.refresh('srcutype'); }, 100);
            commonfun.loaderhide();
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
            console.log(err);
            commonfun.loaderhide();
        }, () => {

        })
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
            "enttid": this.enttid,
            "wsautoid": this._wsdetails.wsautoid,
            "search": query
        }).subscribe((data) => {
            this.entityDT = data.data;
        }, err => {
            this._msg.Show(messageType.error, "Error", err);
        }, () => {

        });
    }

    // Selected Owners

    selectEntityData(event) {
        this.enttid = event.value;
        this.enttname = event.label;

        Cookie.set("_enttid_", event.value);
        Cookie.set("_enttnm_", event.label);

        this.getUserDetails();
    }

    // Auto Completed User

    getAutoUsers(event) {
        var that = this;
        let query = event.query;

        that._autoservice.getAutoData({
            "flag": "allusers",
            "uid": that.loginUser.uid,
            "ucode": that.loginUser.ucode,
            "utype": that.loginUser.utype,
            "issysadmin": that.loginUser.issysadmin,
            "wsautoid": that._wsdetails.wsautoid,
            "srcutype": that.srcutype,
            "search": query
        }).subscribe(data => {
            that.autoUserDT = data.data;
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
        }, () => {

        });
    }

    // Selected User

    selectAutoUsers(event, arg) {
        this.autouid = event.uid;
        this.getUserDetails();
    }

    public viewUserDataRights() {
        var that = this;

        if (Cookie.get('_srcutype_') != null) {
            that.srcutype = Cookie.get('_srcutype_');
        }
        else {
            that.srcutype = "all";
        }

        if (Cookie.get('_enttnm_') != null) {
            that.enttid = parseInt(Cookie.get('_enttid_'));
            that.enttname = Cookie.get('_enttnm_');
        }
        else {
            that.enttid = that._enttdetails.enttid;
            that.enttname = that._enttdetails.enttname;
        }
        
        that.enttdata.value = that.enttid;
        that.enttdata.label = that.enttname;

        that.getUserDetails();
    }

    getUserDetails() {
        var that = this;
        var uparams = {};

        Cookie.set("_srcutype_", that.srcutype);
        that.srcutype = Cookie.get('_srcutype_');

        commonfun.loader("#users");

        uparams = {
            "flag": "all", "uid": that.loginUser.uid, "ucode": that.loginUser.ucode, "utype": that.loginUser.utype,
            "issysadmin": that.loginUser.issysadmin, "wsautoid": that._wsdetails.wsautoid, "srcutype": that.srcutype,
            "srcuid": that.autouid
        };

        that._userservice.getUserDetails(uparams).subscribe(data => {
            try {
                that.usersDT = data.data;
            }
            catch (e) {
                that._msg.Show(messageType.error, "Error", e);
            }

            commonfun.loaderhide("#users");
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
            console.log(err);
            commonfun.loaderhide("#users");
        }, () => {

        })
    }

    resetUserDetails() {
        Cookie.delete('_enttid_');
        Cookie.delete('_enttnm_');
        Cookie.delete('_srcutype_');

        this.enttid = 0;
        this.enttname = "";
        this.enttdata = [];
        this.srcutype = "all";
        Cookie.set("_srcutype_", this.srcutype);
        this.srcutype = Cookie.get('_srcutype_') !== null ? Cookie.get('_srcutype_') : "";

        this.autouid = 0;
        this.autouname = [];

        this.getUserDetails();
    }

    public ngOnDestroy() {
        $.AdminBSB.islocked = false;
        $.AdminBSB.leftSideBar.Open();
    }
}
