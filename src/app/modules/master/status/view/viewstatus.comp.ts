import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, messageType, MenuService, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { LazyLoadEvent } from 'primeng/primeng';
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Component({
    templateUrl: 'viewstatus.comp.html',
    providers: [MenuService]
})

export class ViewStatusComponent implements OnInit {
    statusDT: any = [];
    loginUser: LoginUserModel;

    _wsdetails: any = [];

    entityDT: any = [];
    enttid: number = 0;
    enttname: string = "";

    global = new Globals();
    uploadconfig = { server: "", serverpath: "", uploadurl: "", filepath: "", method: "post", maxFilesize: "", acceptedFiles: "" };

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService,
        private _loginservice: LoginService, private _autoservice: CommonService) {
        this.loginUser = this._loginservice.getUser();
        this._wsdetails = Globals.getWSDetails();
        this.viewStatusDataRights();
    }

    public ngOnInit() {

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

        Cookie.set("_enttid_", this.enttid.toString());
        Cookie.set("_enttnm_", this.enttname);

        this.getStatusDetails();
    }

    public viewStatusDataRights() {
        var that = this;

        if (Cookie.get('_enttnm_') != null) {
            that.enttid = parseInt(Cookie.get('_enttid_'));
            that.enttname = Cookie.get('_enttnm_');
            that.getStatusDetails();
        }
    }

    getStatusDetails() {
        var that = this;
        var params = {};

        commonfun.loader();

        params = {
            "flag": "all",
            "group": "taskstatus",
            "enttid": that.enttid,
            "wsautoid": that._wsdetails.wsautoid
        }

        that._autoservice.getMOM(params).subscribe(data => {
            try {
                that.statusDT = data.data;
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

    public addStatusForm() {
        this._router.navigate(['/master/status/add']);
    }

    public editStatusForm(row) {
        this._router.navigate(['/master/status/edit', row.autoid]);
    }
}
