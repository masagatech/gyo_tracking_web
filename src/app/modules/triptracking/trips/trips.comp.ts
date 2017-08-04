import { Component, OnInit, Input } from '@angular/core';
import { TTMapService } from '@services/master';
import { MessageService, messageType, LoginService, TrackDashbord } from '@services';
import { LoginUserModel, Globals } from '@models';

@Component({
    templateUrl: './trips.comp.html',
    styleUrls: ['./style.css']
})

export class TripsComponent implements OnInit {
    loginUser: LoginUserModel;
    global = new Globals();

    taskDT: any = [];
    stopsDT: any = [];

    constructor(private _msg: MessageService, private _ttmapservice: TTMapService, private _loginservice: LoginService,
        private _trackDashbord: TrackDashbord) {
        this.loginUser = this._loginservice.getUser();
        this.getUserTask();
    }

    ngOnInit() {

    }

    getUserTask() {
        var that = this;

        that._trackDashbord.gettrackboard({
            "flag": "task", "enttid": "1", "uid": that.loginUser.uid
        }).subscribe(data => {
            that.taskDT = data.data;
            commonfun.loaderhide("#loaderbody");
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
            commonfun.loaderhide("#loaderbody");
        }, () => {
        });
    }

    getUserStops() {
        var that = this;

        that._trackDashbord.gettrackboard({
            "flag": "stops", "enttid": "1", "uid": that.loginUser.uid
        }).subscribe(data => {
            that.stopsDT = data.data;
            commonfun.loaderhide("#loaderbody");
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
            commonfun.loaderhide("#loaderbody");
        }, () => {
        });
    }
}