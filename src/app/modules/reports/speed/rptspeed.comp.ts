import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, messageType, MenuService, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { ReportsService } from '@services/master';
import { LazyLoadEvent } from 'primeng/primeng';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';
import jsPDF from 'jspdf'

@Component({
    templateUrl: 'rptspeed.comp.html',
    providers: [MenuService, CommonService]
})

export class SpeedReportsComponent implements OnInit, OnDestroy {
    speedDT: any = [];
    loginUser: LoginUserModel;

    _wsdetails: any = [];

    entityDT: any = [];
    enttid: number = 0;
    enttname: string = "";

    driverDT: any = [];
    drvid: number = 0;
    drvname: string = "";

    actaddrights: string = "";
    acteditrights: string = "";
    actviewrights: string = "";

    @ViewChild('speed') speed: ElementRef;

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService, public _menuservice: MenuService,
        private _loginservice: LoginService, private _autoservice: CommonService, private _rptservice: ReportsService) {
        this.loginUser = this._loginservice.getUser();
        this._wsdetails = Globals.getWSDetails();
        this.viewSpeedDataRights();
    }

    public ngOnInit() {
        setTimeout(function () {
            $(".enttname input").focus();
            commonfun.navistyle();

            $.AdminBSB.islocked = true;
            $.AdminBSB.leftSideBar.Close();
            $.AdminBSB.rightSideBar.activate();
        }, 100);
    }

    // Export

    public exportToCSV() {
        new Angular2Csv(this.speedDT, 'speedReports', { "showLabels": true });
    }

    public exportToPDF() {
        let pdf = new jsPDF('l', 'pt', 'a4');
        let options = {
            pagesplit: true
        };
        pdf.addHTML(this.speed.nativeElement, 0, 0, options, () => {
            pdf.save("speedReports.pdf");
        });
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

        this.getDriverData(event);
    }

    // Auto Completed Driver

    getDriverData(event) {
        let query = event.query;

        this._autoservice.getAutoData({
            "flag": "driver",
            "uid": this.loginUser.uid,
            "ucode": this.loginUser.ucode,
            "utype": this.loginUser.utype,
            "issysadmin": this.loginUser.issysadmin,
            "wsautoid": this._wsdetails.wsautoid,
            "enttid": this.enttid,
            "search": query
        }).subscribe((data) => {
            this.driverDT = data.data;
        }, err => {
            this._msg.Show(messageType.error, "Error", err);
        }, () => {

        });
    }

    // Selected Driver

    selectDriverData(event) {
        this.enttid = event.value;
        this.enttname = event.label;

        Cookie.set("_drvid_", this.drvid.toString());
        Cookie.set("_drvnm_", this.drvname);

        this.getSpeedVialationReports();
    }

    public viewSpeedDataRights() {
        var that = this;
        var addRights = [];
        var editRights = [];
        var viewRights = [];

        that._menuservice.getMenuDetails({
            "flag": "actrights", "uid": that.loginUser.uid, "ucode": that.loginUser.ucode, "mcode": "rptspd", "utype": that.loginUser.utype
        }).subscribe(data => {
            addRights = data.data.filter(a => a.mrights === "add");
            editRights = data.data.filter(a => a.mrights === "edit");
            viewRights = data.data.filter(a => a.mrights === "view");

            that.actaddrights = addRights.length !== 0 ? addRights[0].mrights : "";
            that.acteditrights = editRights.length !== 0 ? editRights[0].mrights : "";
            that.actviewrights = viewRights.length !== 0 ? viewRights[0].mrights : "";

            if (Cookie.get('_enttnm_') != null) {
                that.enttid = parseInt(Cookie.get('_enttid_'));
                that.enttname = Cookie.get('_enttnm_');

                that.drvid = parseInt(Cookie.get('_drvid_'));
                that.drvname = Cookie.get('_devnm_');

                that.getSpeedVialationReports();
            }
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
        }, () => {

        })
    }

    getSpeedVialationReports() {
        var that = this;

        var _speedPickData = [];
        var _speedDropData = [];

        var picktrpdate, pickvehname, pickrtname, picktopspeed;
        var droptrpdate, dropvehname, droprtname, droptopspeed;

        var _pickJsonData: string = "";
        var _dropJsonData: string = "";

        if (that.actviewrights === "view") {
            commonfun.loader();

            that._rptservice.getSpeedVialationReports({
                "flag": "all", "uid": that.loginUser.uid, "ucode": that.loginUser.ucode, "utype": that.loginUser.utype,
                "issysadmin": that.loginUser.issysadmin, "wsautoid": that._wsdetails.wsautoid, "enttid": that.enttid, "drvid": that.drvid
            }).subscribe(data => {
                try {
                    that.speedDT = data.data;
                    
                    // _speedPickData = data.data.filter(a => a.pdtype === "p");
                    // _speedDropData = data.data.filter(a => a.pdtype === "d");

                    // for (var p = 0; p < _speedPickData.length; p++) {
                    //     picktrpdate = _speedPickData[p].trpdate;
                    //     pickvehname = _speedPickData[p].vehiclename;
                    //     pickrtname = _speedPickData[p].rtname;
                    //     picktopspeed = _speedPickData[p].topspeed;

                    //     _pickJsonData += '"picktrpdate":"' + picktrpdate + '", "pickvehname":"' + pickvehname + '", "pickrtname":"' + pickrtname + '", "picktopspeed":"' + picktopspeed + '",';
                    // }

                    // for (var d = 0; d < _speedDropData.length; d++) {
                    //     droptrpdate = _speedDropData[d].trpdate;
                    //     dropvehname = _speedDropData[d].vehiclename;
                    //     droprtname = _speedDropData[d].rtname;
                    //     droptopspeed = _speedDropData[d].topspeed;

                    //     _dropJsonData += '"droptrpdate":"' + droptrpdate + '", "dropvehname":"' + dropvehname + '", "droprtname":"' + droprtname + '", "droptopspeed":"' + droptopspeed + '",';
                    // }

                    // that.speedDT.push({
                    //     "pickdata": JSON.parse("{" + _pickJsonData.substring(0, _pickJsonData.length - 1) + "}"),
                    //     "dropdata": JSON.parse("{" + _dropJsonData.substring(0, _dropJsonData.length - 1) + "}"),
                    // });
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
    }

    public ngOnDestroy() {
        $.AdminBSB.islocked = false;
        $.AdminBSB.leftSideBar.Open();
    }
}
