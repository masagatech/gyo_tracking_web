import { Component, OnInit, OnDestroy, ViewChild, ViewEncapsulation, AfterViewInit, ComponentFactoryResolver, forwardRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService, SocketService, TrackDashbord } from '@services';
import { LoginUserModel, Globals } from '@models';
import { TTMapService } from '@services/master';
import { LazyLoadEvent, DataTable } from 'primeng/primeng';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { SelectItem, GMap } from 'primeng/primeng';
import { ADHOST } from '@directives';
import { HOSTComponent } from '@interface';
import { TripsComponent } from './trips/trips.comp';
import { InfoComponent } from './info/info.comp';
import { HistoryComponent } from './history/history.comp';

declare var google: any;

@Component({
    templateUrl: 'ttmap.comp.html',
    providers: [CommonService, SocketService, TrackDashbord]
})

export class TripTrackingComponent implements OnInit, OnDestroy, AfterViewInit {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    global = new Globals();

    @ViewChild(ADHOST)
    private _Host: ADHOST;

    selectedTripType: number = 0;
    triptype: SelectItem[];

    @ViewChild("gmap")
    _gmap: GMap;

    map: any;
    marker: any;
    overlays: any = [];

    employeeDT: any = [];
    empIds: any = [];
    empid: number = 0;
    selectedEmp: any = [];
    selectedSEmp: any = {};
    selectedFlwEmp: any = {};

    tripDT: any = [];
    messageDT: any = [];
    psngrDT: any = [];

    isPlay: boolean = true;

    options: any = [];

    sel_tripid: number = 0;
    sel_msttripid: number = 0;

    connectmsg: string = "";
    lastlat: string = "";
    lastlon: string = "";

    vhmarkers: any = [];

    dbcaller: any = [];

    //side bar
    sidebarTitle = "Title";
    trafficLayer: any = new google.maps.TrafficLayer();

    markerOptions = {
        showinfo: false,
        hidelive: false,
        showtrafic: false
    }

    constructor(private _ttmapservice: TTMapService, private _msg: MessageService, private _autoservice: CommonService,
        private _loginservice: LoginService, private _socketservice: SocketService,
        private _trackDashbord: TrackDashbord, private componentFactoryResolver: ComponentFactoryResolver) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.getMessage();
    }

    private loadComponent(component, data) {
        let componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);
        let viewContainerRef = this._Host.viewContainerRef;
        viewContainerRef.clear();
        let componentRef = viewContainerRef.createComponent(componentFactory);
        (<HOSTComponent>componentRef.instance).data = data;
    }

    ngOnInit() {
        this._socketservice.close();
        this.getDefaultMap();

        setTimeout(function () {
            $.AdminBSB.islocked = true;
            $.AdminBSB.leftSideBar.Close();
            $.AdminBSB.rightSideBar.closeonwindow = false;//do not close right bar on window click
            $(".enttname input").focus();
            $('.container-fluid').css('padding-left', '0px').css('padding-right', '0px');
        }, 100);

        this.fillEmployeeDropDown();
    }

    public ngAfterViewInit() {
        this.map = this._gmap.getMap();
        SlidingMarker.initializeGlobally();
    }

    getDefaultMap() {
        this.options = {
            center: { lat: 22.861639, lng: 78.257621 },
            zoom: 5
        };
    }

    getTripType() {
        this.triptype = [];
        this.triptype.push({ "label": "Pending", "value": "0" });
        this.triptype.push({ "label": "Started", "value": "1" });
        this.triptype.push({ "label": "Completed", "value": "2" });
    }

    // Employee DropDown

    private fillEmployeeDropDown() {
        var that = this;
        commonfun.loader();
        this.employeeDT = [];
        this.empIds = [];

        that._trackDashbord.gettrackboard({
            "flag": "employee",
            "enttid": that._enttdetails.enttid,
            "uid": that.loginUser.uid,
            "ucode": that.loginUser.ucode,
            "utype": that.loginUser.utype,
            "issysadmin": that.loginUser.issysadmin,
            "wsautoid": that._enttdetails.wsautoid
        }).subscribe((data) => {
            try {
                that.employeeDT = data.data;
                
                for (var k = 0; k < that.employeeDT.length; k++) {
                    var el = that.employeeDT[k];
                    el.uid = el.empid;
                    el.isfollow = false;
                    el.sel = false;
                    that.empIds.push(el.empid);
                }

                that.getLastUpdateAndSubscribe(null);
                that.setLiveBeatsOn();
            }
            catch (e) {
                that._msg.Show(messageType.error, "Error", e);
            }
            commonfun.loaderhide();
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
            commonfun.loaderhide();
        }, () => {

        })
    }

    // Get Selected Trip ID for get Map Data

    getTTMap(row) {
        var that = this;

        that.sel_tripid = row.trpid;
        that.sel_msttripid = row.id;
    }

    // get Tracking Map Data

    getMessage() {
        var that = this;
        commonfun.loader();
        that.connectmsg = "Registering...";

        this._socketservice.getMessage().subscribe(data => {
            var _d = data;
            console.log(_d);
            if (_d["evt"] == "regreq") {
                if (that.empIds.length > 0) { 
                   
                    that._socketservice.sendMessage("reg_v", that.empIds.join(','));
                }
            }
            else if (_d["evt"] == "registered") {
                
                that.connectmsg = "Registered...";
                setTimeout(function () {
                    that.connectmsg = "Waiting for data..";
                }, 1000);
            }
            else if (_d["evt"] == "data") {
                try {
                    var geoloc = _d["data"];
                    console.log(geoloc);
                    let el = that.employeeDT.find(a => a.uid === parseInt(geoloc.uid));

                    if (el !== undefined) {
                        el.tripid = geoloc.tripid;
                        el.speed = geoloc.speed;
                        el.bearing = geoloc.bearing;
                        el.btr = geoloc.btr;
                        el.loc = [geoloc.lon, geoloc.lat];
                        el.sertm = geoloc.sertm;
                        el.isshow = true;
                        el.min = 0;
                        el.flag = geoloc.flag;
                        el.ju = true;
                    }

                    this.moveMarker([geoloc.lat, geoloc.lon], geoloc.uid, geoloc.bearing);
                } catch (error) {

                }
            }
            commonfun.loaderhide();
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
            commonfun.loaderhide();
        }, () => {
        });
    }

    // private get timeinterval

    private setLiveBeatsOn() {
        if (this.dbcaller !== undefined) {
            clearInterval(this.dbcaller);
        }
        if (this.empIds.length > 0) {
            let that = this;
            this.dbcaller = setInterval(
                function () {
                    that.logicLiveBeat();
                }, 30000);

            that._socketservice.close();
            that._socketservice.connect();
        }
    }

    private logicLiveBeat() {
        let _data = [];

        for (var i = 0; i < this.employeeDT.length; i++) {
            var _el = this.employeeDT[i];

            if (_el.isshow == true) {
                _el.min = this.getTimeDiff(_el.sertm);

                if (_el.min > 3 || _el.ju == false) {
                    _el.ju = false;
                    _data.push(_el.uid);
                }
            }
            else {
                _data.push(_el.uid);
            }
        }

        this.getLastUpdateAndSubscribe(_data);
    }

    private getTimeDiff(sertm): any {
        let now = new Date();
        let seconds = Math.round(Math.abs((now.getTime() - new Date(sertm).getTime()) / 1000));
        let minutes = Math.round(Math.abs(seconds / 60))
        return minutes;
    }

    // get vehicle last data and subscribe for socket{}

    private getLastUpdateAndSubscribe(data) {
        if (data !== null && data.length === 0) return;

        this._trackDashbord.getvahicleupdates({
            "empids": data == null ? this.empIds : data
        }).subscribe(_d => {
            this.refreshdata(_d.data);
        }, err => {
            this._msg.Show(messageType.error, "Error", err);
            commonfun.loaderhide();
        }, () => {
        })
    }

    private refreshdata(data) {
        for (let i = 0; i < this.employeeDT.length; i++) {
            let el = this.employeeDT[i];
            let d = data.find(f => f.uid === el.uid);

            if (d !== undefined) {
                el.tripid = d.tripid;
                el.speed = d.speed;
                el.bearing = d.bearing;
                el.btr = d.btr;
                el.loc = d.loc;
                el.sertm = d.sertm;
                el.min = this.getTimeDiff(d.sertm);
                el.isshow = true;
                el.ju = false;
                el.flag = d.flag;

                this.moveMarker([el.loc[1], el.loc[0]], el.uid, el.bearing);
            } else if (el.ju) {

            } else {
                el.isshow = false;
            }
        }
    }

    //move marker
    private moveMarker(loc, empid, bearing) {
        let mrk = this.vhmarkers[empid];

        if (mrk !== undefined) {
            let bear = 0;

            let _ico = mrk.getIcon().ico;
            // mrk.setIcon({ url: 'assets/img/map/' + _ico + '_' + bear + '.png?v=1', ico: _ico })
            mrk.setIcon({ url: 'assets/img/map/0.png?v=1', ico: _ico })
            mrk.setPosition(new google.maps.LatLng(loc[0], loc[1]));

            if (this.selectedFlwEmp.uid !== undefined && this.selectedFlwEmp.uid == empid) {
                this.map.setCenter(new google.maps.LatLng(loc[0], loc[1]))
            }
        }
    }

    //select for map show

    private onchange(e, emp) {
        if (emp.isshow === undefined || emp.isshow === false) {
            this._msg.Show(messageType.warn, "Hey", "No Updates found"); e.target.checked = false; return
        }
        else {
            if (e.target.checked) {

                this.selectedEmp.push(emp.uid);
                this.addmarker(emp);
                this.boundtomap()
            } else {
                let i = this.selectedEmp.indexOf(emp.uid);
                if (i > -1) {
                    this.selectedEmp.splice(i, 1);
                }

                if (this.selectedEmp.length > 0) {
                    this.boundtomap();
                } else {
                    this.map.setZoom(5);
                    this.map.setCenter(new google.maps.LatLng(this.options.center.lat, this.options.center.lng))
                }
                this.removemarker(emp.uid);
            }
        }
        
        e.preventDefault();
    }

    //get bound
    
    private boundtomap() {
        if (this.selectedEmp.length <= 0) {
            return;
        }
        
        var bounds = new google.maps.LatLngBounds();

        for (let i = 0; i < this.selectedEmp.length; i++) {
            let el = this.selectedEmp[i];
            let mr = this.vhmarkers[el];
            bounds.extend(mr.getPosition());
        }
        this.map.fitBounds(bounds);
    }

    private showinfowindow() {
        for (let i = 0; i < this.selectedEmp.length; i++) {
            let el = this.selectedEmp[i];
            let mr = this.vhmarkers[el];
            if (this.markerOptions.showinfo) {
                mr.info.open(this.map, mr);
            } else {
                mr.info.close();
            }
        }
    }

    private hidelives() {
        for (let i = 0; i < this.selectedEmp.length; i++) {
            let el = this.selectedEmp[i];
            let mr = this.vhmarkers[el];

            if (this.markerOptions.hidelive) {
                mr.setMap(null);
            }
            else {
                mr.setMap(this.map);
            }
        }
    }

    private showHidetraffic() {
        if (this.markerOptions.showtrafic) {
            this.trafficLayer.setMap(this.map);
        } else {
            this.trafficLayer.setMap(null);
        }
    }

    private follow_click(emp) {
        if (!emp.sel) { return; }
        if (emp.isshow === undefined || emp.isshow === false) { return; }
        emp.isfollow = !emp.isfollow;

        if (this.selectedFlwEmp.isfollow !== undefined) {
            if (emp.uid !== this.selectedFlwEmp.uid)
                this.selectedFlwEmp.isfollow = false;
        }
        if (emp.isfollow && emp.uid !== this.selectedFlwEmp.uid) {
            this.map.setCenter(new google.maps.LatLng(emp.loc[1], emp.loc[0]));
            this.selectedFlwEmp = emp;
            this.map.setZoom(17);
        } else {
            this.selectedFlwEmp = {};
        }
    }

    private addmarker(emp) {
        let bearing = 0;//commonfun.getbearing((emp.bearing || 0));
        let imagePath = 'assets/img/map/0.png?v=1';
        let image = {
            url: imagePath,
            ico: emp.empph
        };

        let vhmarker = new google.maps.Marker({
            position: {
                lat: emp.loc[1], lng: emp.loc[0]
            },
            strokeColor: 'red',
            strokeWeight: 3,
            scale: 6,
            icon: image,
            animation: google.maps.Animation.BOUNCE,
            title: emp.empname + ' (' + emp.empcode + ')',
        });

        vhmarker.info = new google.maps.InfoWindow({
            content: vhmarker.title
        });

        if (this.markerOptions.showinfo) {
            vhmarker.info.open(this.map, vhmarker);
        }

        vhmarker.setMap(this.map);
        this.vhmarkers[emp.uid] = vhmarker;
    }

    private removemarker(empid) {
        let mrkr = this.vhmarkers[empid];

        if (mrkr != null) {
            mrkr.setMap(null);
            delete this.vhmarkers[empid];
        }
    }

    private info_click(emp, event) {
        // if (emp.isshow === undefined || emp.isshow === false) {
        //     this._msg.Show(messageType.warn, "Hey", "No Updates found"); return;
        // }

        this.sidebarTitle = "Info";
        this.selectedSEmp = emp;
        this.loadComponent(InfoComponent, { "empid": emp.uid, loginUser: this.loginUser, _enttdetails: this._enttdetails });

        commonfun.loader("#loaderbody", "pulse", 'Loading Vehicle Info...')
        $.AdminBSB.rightSideBar.Open();
        event.stopPropagation();
    }

    private stop_click(emp, event) {
        this.sidebarTitle = "Stops";
        this.selectedSEmp = emp;
        this.loadComponent(TripsComponent, { "tripid": emp.tripid, loginUser: this.loginUser, _enttdetails: this._enttdetails });

        // commonfun.loader("#loaderbody", "pulse", 'Loading Stops...')
        // $.AdminBSB.rightSideBar.Open();

        event.stopPropagation();
    }

    private history_click(emp, event) {
        this.loadComponent(HistoryComponent, { "empid": emp.uid, loginUser: this.loginUser, _enttdetails: this._enttdetails, map: this.map });

        this.sidebarTitle = "History";
        this.selectedSEmp = emp;
        commonfun.loader("#loaderbody", "timer", 'Loading History...');

        $.AdminBSB.rightSideBar.Open();
        event.stopPropagation();
    }

    private close_sidebar() {
        commonfun.loaderhide("#loaderbody")
        $.AdminBSB.rightSideBar.Close();
    }

    private closesidepanel() {
        if ($("#sidepanel").hasClass('col-md-3')) {
            $("#sidepanel").removeClass('col-md-3').addClass('hide');
            $("#map").removeClass('col-md-9').addClass('col-md-12');
            $("#closeicon").text('keyboard_arrow_right');
        }
        else {
            $("#sidepanel").addClass('col-md-3').removeClass('hide');
            $("#map").removeClass('col-md-12').addClass('col-md-9');
            $("#closeicon").text('keyboard_arrow_left');
        }
        if (this.map !== undefined) {
            google.maps.event.trigger(this.map, 'resize');
        }
    }

    public ngOnDestroy() {
        if (this.dbcaller !== undefined) {
            clearInterval(this.dbcaller);
        }

        $.AdminBSB.islocked = false;
        $.AdminBSB.rightSideBar.closeonwindow = true;//do not close right bar on window click
        $.AdminBSB.leftSideBar.Open();

        $('.container-fluid').css('padding-left', '5px').css('padding-right', '5px');
        this._socketservice.close();
    }
}