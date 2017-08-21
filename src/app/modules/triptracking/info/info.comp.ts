import { Component, OnInit, Input } from '@angular/core';
import { TTMapService } from '@services/master';
import { MessageService, messageType, TrackDashbord } from '@services';
import { LoginUserModel, Globals } from '@models';

@Component({
    templateUrl: './info.comp.html'
})

export class InfoComponent implements OnInit {
    @Input() data: any;
    tripDT: any = [];
    empinfo: any = {};
    global = new Globals();

    constructor(private _msg: MessageService, private _ttmapservice: TTMapService, private _trackDashbord: TrackDashbord) {
    }

    ngOnInit() {
        this.getTripData();
        this.getEmployeeInfo();
    }

    // Get Today's Trip

    private getTripData() {
        var that = this;
        this._ttmapservice.getTripData({
            "flag": "vh",
            "vehid": this.data.vhid,
            "uid": this.data.loginUser.uid,
            "utype": this.data.loginUser.utype,
            "issysadmin": this.data.loginUser.issysadmin,
            "wsautoid": this.data._enttdetails.wsautoid
        }).subscribe(data => {
            that.tripDT = data.data;
            commonfun.loaderhide("#loaderbody");
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
            commonfun.loaderhide("#loaderbody");
        }, () => {
        });
    }

    private getEmployeeInfo() {
        if (this.empinfo.vhid !== undefined) { return; }
        var that = this;
        commonfun.loader("#loaderbody");

        this._trackDashbord.gettrackboard({
            "flag": "empid",
            "empid": this.data.empid,
            "wsautoid": this.data._enttdetails.wsautoid
        }).subscribe((data) => {
            try {
                that.empinfo = data.data[0];
            }
            catch (e) {
                that._msg.Show(messageType.error, "Error", e);
            }
            commonfun.loaderhide("#loaderbody");
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
            commonfun.loaderhide("#loaderbody");
        }, () => {

        })
    }
}