import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, messageType, LoginService, MenuService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { TripReportsService } from '@services/master';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import jsPDF from 'jspdf';

@Component({
    templateUrl: 'rpttrp.comp.html',
    providers: [CommonService, MenuService, TripReportsService]
})

export class TripReportsComponent implements OnInit, OnDestroy {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    employeeDT: any = [];
    empdata: any = [];
    empid: number = 0;
    empname: string = "";

    monthDT: any = [];

    monthname: string = "";

    triptype: string = "";
    tripSummaryDT: any = [];
    tripDetailsDT: any = [];

    @ViewChild('emptrips') emptrips: ElementRef;

    global = new Globals();
    uploadconfig = { server: "", serverpath: "", uploadurl: "", filepath: "", method: "post", maxFilesize: "", acceptedFiles: "" };

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService,
        public _menuservice: MenuService, private _loginservice: LoginService, private _rpttrpservice: TripReportsService,
        private _autoservice: CommonService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();
    }

    public ngOnInit() {
        setTimeout(function () {
            commonfun.navistyle();

            $.AdminBSB.islocked = true;
            $.AdminBSB.leftSideBar.Close();
            $.AdminBSB.rightSideBar.activate();
        }, 100);
    }

    public downloadImage(row) {
        var a = $("<a>")
            .attr("href", this.global.uploadurl + row.uploadimg)
            .attr("download", "download." + row.imgtype)
            .appendTo("body");

        a[0].click();

        a.remove();
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
            "wsautoid": this._enttdetails.wsautoid,
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

        this.getTripSummary();
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

    // Summary

    getTripSummary() {
        var that = this;

        if (that.empid == 0) {
            that._msg.Show(messageType.info, "Info", "Please Enter Employee Name");
        }
        else {
            commonfun.loader();

            that._rpttrpservice.getTripReports({
                "enttid": that._enttdetails.enttid, "empid": that.empid, "uid": that.loginUser.uid, "utype": that.loginUser.utype,
                "wsautoid": that._enttdetails.wsautoid, "issysadmin": that.loginUser.issysadmin, "vtype": "p"
            }).subscribe(data => {
                try {
                    if (data.data.length !== 0) {
                        for (var i = 0; i < data.data.length; i++) {
                            var trprow = data.data[i];
                            trprow.kilometer = that.getDistanceFromLatLonInKm(trprow.strlat, trprow.strlng, trprow.endlat, trprow.endlng);
                        }

                        that.tripSummaryDT = data.data;
                    }
                    else {
                        that.tripSummaryDT = [];
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

    // Details

    getTripDetails(vtype, row) {
        var that = this;

        if (that.empid == 0) {
            that._msg.Show(messageType.info, "Info", "Please Enter Employee Name");
        }
        else {
            $("#stopsModal").modal('show');
            commonfun.loader("#stopsModal");

            that._rpttrpservice.getTripReports({
                "vtype": vtype, "enttid": that._enttdetails.enttid, "empid": that.empid, "uid": that.loginUser.uid, "utype": that.loginUser.utype,
                "wsautoid": that._enttdetails.wsautoid, "issysadmin": that.loginUser.issysadmin, "trpdate": row.trpdate
            }).subscribe(data => {
                try {
                    if (data.data.length !== 0) {
                        that.tripDetailsDT = data.data;
                        that.triptype = vtype == 'stops' ? "Stops" : "Task";
                    }
                    else {
                        that.tripDetailsDT = [];
                        that.triptype = "";
                    }
                }
                catch (e) {
                    that._msg.Show(messageType.error, "Error", e);
                }

                commonfun.loaderhide("#stopsModal");
            }, err => {
                that._msg.Show(messageType.error, "Error", err);
                console.log(err);
                commonfun.loaderhide("#stopsModal");
            }, () => {

            })
        }
    }

    // Export

    public exportToCSV() {
        var that = this;

        if (that.empid == 0) {
            that._msg.Show(messageType.info, "Info", "Please Enter Employee Name");
        }
        else {
            var tripExportDT: any = [];
            commonfun.loader();

            that._rpttrpservice.getTripReports({
                "enttid": that._enttdetails.enttid, "empid": that.empid, "uid": that.loginUser.uid, "utype": that.loginUser.utype,
                "wsautoid": that._enttdetails.wsautoid, "issysadmin": that.loginUser.issysadmin, "vtype": "export"
            }).subscribe(data => {
                try {
                    if (data.data.length !== 0) {
                        tripExportDT = data.data;
                        that._autoservice.exportToCSV(tripExportDT, "Employee Trips");
                    }
                    else {
                        tripExportDT = [];
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

    public exportToPDF() {
        let pdf = new jsPDF('l', 'pt', 'a4');
        let options = {
            pagesplit: true
        };
        pdf.addHTML(this.emptrips.nativeElement, 0, 0, options, () => {
            pdf.save("Employee Trips.pdf");
        });
    }

    public ngOnDestroy() {
        $.AdminBSB.islocked = false;
        $.AdminBSB.leftSideBar.Open();
    }
}
