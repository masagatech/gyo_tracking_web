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
    _enttdetails: any = [];

    employeeDT: any = [];
    empdata: any = [];
    empid: number = 0;
    empname: string = "";

    monthDT: any = [];

    monthname: string = "";

    tripData: any = [];

    @ViewChild('emptrips') attnatt: ElementRef;

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService,
        public _menuservice: MenuService, private _loginservice: LoginService, private _rptservice: ReportsService,
        private _autoservice: CommonService) {
        this.loginUser = this._loginservice.getUser();
        this._wsdetails = Globals.getWSDetails();
        this._enttdetails = Globals.getEntityDetails();

        this.getTripReports();
    }

    public ngOnInit() {
        setTimeout(function () {
            commonfun.navistyle();

            $.AdminBSB.islocked = true;
            $.AdminBSB.leftSideBar.Close();
            $.AdminBSB.rightSideBar.activate();
        }, 100);
    }

    // Export

    public exportToCSV() {
        new Angular2Csv(this.tripData, 'EmployeeTrips', { "showLabels": true });
    }

    public exportToPDF() {
        let pdf = new jsPDF('l', 'pt', 'a4');
        let options = {
            pagesplit: true
        };
        pdf.addHTML(this.attnatt.nativeElement, 0, 0, options, () => {
            pdf.save("EmployeeTrips.pdf");
        });
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
        this.empname = event.label;

        this.getTripReports();
    }

    // Get Trip Data

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

        that._rptservice.getTripReports({
            "enttid": that._enttdetails.enttid, "uid": that.empid, "vtype": "p"
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

    public ngOnDestroy() {
        $.AdminBSB.islocked = false;
        $.AdminBSB.leftSideBar.Open();
    }
}
