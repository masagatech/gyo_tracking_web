import { Component, OnInit, OnDestroy } from '@angular/core';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { Router } from '@angular/router';
import { LazyLoadEvent, DataTable } from 'primeng/primeng';
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Component({
    templateUrl: 'viewMOM.comp.html',
    providers: [CommonService]
})

export class ViewMOMComponent implements OnInit, OnDestroy {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    momGroupDT: any = [];
    momDT: any = [];
    headertitle: string = "";

    constructor(private _router: Router, private _autoservice: CommonService, private _msg: MessageService, private _loginservice: LoginService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();
        this.fillMOMGroup();
    }

    ngOnInit() {
        setTimeout(function () {
            $.AdminBSB.islocked = true;
            $.AdminBSB.leftSideBar.Close();
            $.AdminBSB.rightSideBar.activate();
        }, 100);
    }

    fillMOMGroup() {
        var that = this;

        that._autoservice.getMOM({ "flag": "group" }).subscribe(data => {
            that.momGroupDT = data.data;
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
        }, () => {
            // console.log("Complete");
        })
    }

    BindMOMGrid(row) {
        var that = this;
        that._autoservice.getMOM({
            "flag": "grid", "group": row.grpcd, "enttid": that._enttdetails.enttid,
            "wsautoid": that._enttdetails.wsautoid
        }).subscribe(data => {
            try {
                Cookie.set("_grpnm_", row.grpnm);

                if (Cookie.get('_grpnm_') != null) {
                    that.headertitle = Cookie.get('_grpnm_');
                }

                that.momDT = data.data;
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

    public addMOMForm() {
        this._router.navigate(['/settings/masterofmaster/add']);
    }

    public editMOMForm(row) {
        this._router.navigate(['/settings/masterofmaster/edit', row.autoid]);
    }

    ngOnDestroy() {
        $.AdminBSB.islocked = false;
        $.AdminBSB.leftSideBar.Open();
    }
}