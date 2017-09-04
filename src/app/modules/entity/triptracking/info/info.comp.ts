import { Component, OnInit, Input } from '@angular/core';
import { TTMapService } from '@services/master';
import { MessageService, messageType, TrackDashbord } from '@services';
import { LoginUserModel, Globals } from '@models';

@Component({
    templateUrl: './info.comp.html'
})

export class InfoComponent implements OnInit {
    @Input() data: any;
    empinfo: any = {};
    global = new Globals();

    constructor(private _msg: MessageService, private _ttmapservice: TTMapService, private _trackDashbord: TrackDashbord) {
    }

    ngOnInit() {
        this.getEmployeeInfo();
    }

    // Get Today's Trip

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