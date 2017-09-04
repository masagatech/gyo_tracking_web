import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { WorkspaceService } from '@services/master';
import { LazyLoadEvent } from 'primeng/primeng';
import { Cookie } from 'ng2-cookies/ng2-cookies';

declare var $: any;

@Component({
    templateUrl: 'viewws.comp.html',
    providers: [WorkspaceService, CommonService]
})

export class ViewWorkspaceComponent implements OnInit {
    loginUser: LoginUserModel;
    workspaceDT: any = [];
    _wsdetails: any = [];

    autoWorkspaceDT: any = [];
    srcwsid: number = 0;
    srcwsname: any = [];

    wsautoid: number = 0;
    wscode: string = "";
    wsname: string = "";
    wslogo: string = "";
    lgcode: string = "";
    issysadmin: boolean = false;

    enttid: number = 0;
    enttnm: string = "";

    headertitle: string = "";

    global = new Globals();
    uploadconfig = { uploadurl: "" };

    isShowGrid: boolean = true;
    isShowList: boolean = false;
    
    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService, private _loginservice: LoginService,
        private _wsservice: WorkspaceService, private _autoservice: CommonService) {
        this.loginUser = this._loginservice.getUser();
        this._wsdetails = Globals.getWSDetails();

        this.getUploadConfig();

        if (Cookie.get('_srcwsnm_') != null) {
            this.srcwsid = parseInt(Cookie.get('_srcwsid_'));
            this.srcwsname = Cookie.get('_srcwsnm_');
        }

        this.getWorkspaceDetails();

        if (!this.loginUser.issysadmin && this.loginUser.utype !== "admin") {
            this._router.navigate(['/']);
        }
    }

    public ngOnInit() {
        this.refreshButtons();
    }

    isshWorkspace(viewtype) {
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

    // Auto Completed Workspace

    getAutoWorkspaceData(event) {
        let query = event.query;

        this._autoservice.getAutoData({
            "flag": "workspace",
            "search": query
        }).subscribe((data) => {
            this.autoWorkspaceDT = data.data;
        }, err => {
            this._msg.Show(messageType.error, "Error", err);
        }, () => {

        });
    }

    // Selected Workspace

    selectAutoWorkspaceData(event) {
        this.srcwsid = event.value;

        Cookie.set("_srcwsid_", event.value);
        Cookie.set("_srcwsnm_", event.label);

        this.getWorkspaceDetails();
    }

    getUploadConfig() {
        this.uploadconfig.uploadurl = this.global.uploadurl
    }

    getWorkspaceDetails() {
        var that = this;
        var myWorkspaceDT = [];

        commonfun.loader();

        that._wsservice.getWorkspaceDetails({
            "flag": "userwise", "uid": that.loginUser.uid, "ucode": that.loginUser.ucode, "utype": that.loginUser.utype,
            "issysadmin": that.loginUser.issysadmin, "wsautoid": that.loginUser.wsautoid, "srcwsid": that.srcwsid
        }).subscribe(data => {
            try {
                that.workspaceDT = data.data; //.filter(a => a.issysadmin === false);
                myWorkspaceDT = data.data.filter(a => a.wsautoid === that.loginUser.wsautoid).filter(a => a.issysadmin === true);

                if (myWorkspaceDT.length > 0) {
                    that.wsautoid = myWorkspaceDT[0].wsautoid;
                    that.wscode = myWorkspaceDT[0].wscode;
                    that.wsname = myWorkspaceDT[0].wsname;
                    that.wslogo = myWorkspaceDT[0].wslogo;
                    that.lgcode = myWorkspaceDT[0].lgcode;
                    that.issysadmin = myWorkspaceDT[0].issysadmin;

                    that.enttid = myWorkspaceDT[0].enttid;
                    that.enttnm = myWorkspaceDT[0].enttnm;
                    that.headertitle = "My Workspace (" + myWorkspaceDT[0].wsname + ")";
                }
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

    resetWorkspaceDetails() {
        this.srcwsid = 0;
        this.srcwsname = "";
        Cookie.delete("_srcwsid_");
        Cookie.delete("_srcwsnm_");

        this.getWorkspaceDetails();
    }

    public addWorkspaceForm() {
        this._router.navigate(['/admin/workspace/add']);
    }

    public editWorkspaceForm(row) {
        this._router.navigate(['/admin/workspace/edit', row.wsautoid]);
    }

    public openDashboardForm(row) {
        Cookie.delete("_wsdetails_");
        Cookie.set("_wsdetails_", JSON.stringify(row));

        this._router.navigate(['/admin/workspace']);
    }

    public openForm() {
        var _wsdetails = {
            "wsautoid": this.wsautoid.toString(),
            "wscode": this.wscode,
            "wsname": this.wsname,
            "wslogo": this.wslogo,
            "issysadmin": this.issysadmin
        }

        Cookie.set("_wsdetails_", JSON.stringify(_wsdetails));
        this._router.navigate(['/workspace/entity']);
    }

    public openEntityForm(row) {
        Cookie.delete("_wsdetails_");
        Cookie.set("_wsdetails_", JSON.stringify(row));

        if (row.countentity !== "0") {
            this._router.navigate(['/workspace/entity']);
        }
        else {
            this._router.navigate(['/workspace/entity/add']);
        }
    }
}
