import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, messageType, LoginService, MenuService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { ReportsService } from '@services/master';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';
import jsPDF from 'jspdf'

@Component({
    templateUrl: 'rptemptrips.comp.html',
    providers: [CommonService, MenuService, ReportsService]
})

export class TripReportsComponent implements OnInit, OnDestroy {
    loginUser: LoginUserModel;
    _wsdetails: any = [];

    monthDT: any = [];

    entityDT: any = [];
    enttid: number = 0;
    enttname: any = [];
    monthname: string = "";

    tripData: any = [];

    @ViewChild('attnatt') attnatt: ElementRef;

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService,
        public _menuservice: MenuService, private _loginservice: LoginService, private _rptservice: ReportsService,
        private _autoservice: CommonService) {
        this.loginUser = this._loginservice.getUser();
        this._wsdetails = Globals.getWSDetails();

        this.viewTripReportsRights();
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
        new Angular2Csv(this.tripData, 'Trip Reports', { "showLabels": true });
    }

    public exportToPDF() {
        let pdf = new jsPDF('l', 'pt', 'a4');
        let options = {
            pagesplit: true
        };
        pdf.addHTML(this.attnatt.nativeElement, 0, 0, options, () => {
            pdf.save("AttendentAttendance.pdf");
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
        
        Cookie.set("_enttid_", event.value);
        Cookie.set("_enttnm_", event.label);

        this.getTripReports();
    }

    // Get Trip Data

    public viewTripReportsRights() {
        var that = this;

        if (Cookie.get('_enttnm_') != null) {
            that.enttid = parseInt(Cookie.get('_enttid_'));
            that.enttname.value = parseInt(Cookie.get('_enttid_'));
            that.enttname = Cookie.get('_enttnm_');

            that.getTripReports();
        }
    }

    deg2rad(deg) {
        return deg * (Math.PI / 180)
    }

    getDistanceFromLatLonInKm(strlat, strlng, endlat, endlng) {
        var R = 6371; // Radius of the earth in km
        var dLat = this.deg2rad(endlat - strlat); // deg2rad below
        var dLon = this.deg2rad(endlng - strlng);
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
            + Math.cos(this.deg2rad(strlat)) * Math.cos(this.deg2rad(endlat)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c; // Distance in km
        return Math.round(d * 100) / 100;
    }

    round2Fixed(value) {
        value = +value;

        if (isNaN(value))
            return NaN;

        // Shift
        value = value.toString().split('e');
        value = Math.round(+(value[0] + 'e' + (value[1] ? (+value[1] + 2) : 2)));

        // Shift back
        value = value.toString().split('e');
        return (+(value[0] + 'e' + (value[1] ? (+value[1] - 2) : -2))).toFixed(2);
    }

    getTripReports() {
        var that = this;

        if (that.enttname === "") {
            that._msg.Show(messageType.warn, "Warning", "Search Entity");
        }
        else {
            that._rptservice.getTripReports({
                "enttid": that.enttid, "uid": that.loginUser.uid
            }).subscribe(data => {
                try {
                    if (data.data.length !== 0) {
                        for (var i = 0; i < data.data.length; i++) {
                            var trprow = data.data[i];
                            trprow.kilometer = that.getDistanceFromLatLonInKm(trprow.strlat, trprow.strlng, trprow.endlat, trprow.endlng);
                        }

                        that.tripData = data.data;
                    }
                    else {
                        that.tripData = [];
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
    }

    public ngOnDestroy() {
        $.AdminBSB.islocked = false;
        $.AdminBSB.leftSideBar.Open();
    }
}
