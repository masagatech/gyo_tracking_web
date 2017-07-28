import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { EmployeeService } from '@services/master';
import { Cookie } from 'ng2-cookies/ng2-cookies';

declare var google: any;

@Component({
    templateUrl: 'addemp.comp.html',
    providers: [CommonService]
})

export class AddEmployeeComponent implements OnInit {
    loginUser: LoginUserModel;
    _wsdetails: any = [];

    entityDT: any = [];
    enttid: number = 0;
    enttname: string = "";

    stateDT: any = [];
    cityDT: any = [];
    areaDT: any = [];

    empid: number = 0;
    loginid: number = 0;
    empcode: string = "";
    emppwd: string = "";
    empname: string = "";
    aadharno: string = "";
    licenseno: string = "";
    mobileno1: string = "";
    mobileno2: string = "";
    email1: string = "";
    email2: string = "";
    address: string = "";
    country: string = "India";
    state: number = 0;
    city: number = 0;
    area: number = 0;
    pincode: number = 0;
    remark1: string = "";
    uploadedFiles: any = [];
    attachDocsDT: any = [];

    mode: string = "";
    isactive: boolean = true;

    uploadPhotoDT: any = [];
    global = new Globals();
    uploadconfig = { server: "", serverpath: "", uploadurl: "", filepath: "", method: "post", maxFilesize: "", acceptedFiles: "" };

    private subscribeParameters: any;

    constructor(private _empservice: EmployeeService, private _routeParams: ActivatedRoute, private _router: Router,
        private _loginservice: LoginService, private _msg: MessageService, private _autoservice: CommonService) {
        this.loginUser = this._loginservice.getUser();
        this._wsdetails = Globals.getWSDetails();

        this.getUploadConfig();

        this.fillStateDropDown();
        this.fillCityDropDown();
        this.fillAreaDropDown();
    }

    public ngOnInit() {
        setTimeout(function () {
            $(".enttname input").focus();
        }, 100);

        this.getEmployeeDetails();
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
    }

    // Get State DropDown

    fillStateDropDown() {
        var that = this;
        commonfun.loader();

        that._autoservice.getDropDownData({ "flag": "state" }).subscribe(data => {
            try {
                that.stateDT = data.data;
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

    // Get City DropDown

    fillCityDropDown() {
        var that = this;
        commonfun.loader();

        that.cityDT = [];
        that.areaDT = [];

        that.city = 0;
        that.area = 0;

        that._autoservice.getDropDownData({ "flag": "city", "sid": that.state }).subscribe(data => {
            try {
                that.cityDT = data.data;
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

    // Get Area DropDown

    fillAreaDropDown() {
        var that = this;
        commonfun.loader();

        that.areaDT = [];

        that.area = 0;

        that._autoservice.getDropDownData({ "flag": "area", "ctid": that.city, "sid": that.state }).subscribe(data => {
            try {
                that.areaDT = data.data;
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

    // Active / Deactive Data

    active_deactiveEmployeeInfo() {
        var that = this;

        var act_deactemp = {
            "empid": that.empid,
            "isactive": that.isactive,
            "mode": that.mode
        }

        this._empservice.saveEmployeeInfo(act_deactemp).subscribe(data => {
            try {
                var dataResult = data.data;

                if (dataResult[0].funsave_empinfo.msgid != "-1") {
                    that._msg.Show(messageType.success, "Success", dataResult[0].funsave_empinfo.msg);
                    that.getEmployeeDetails();
                }
                else {
                    that._msg.Show(messageType.error, "Error", dataResult[0].funsave_empinfo.msg);
                }
            }
            catch (e) {
                that._msg.Show(messageType.error, "Error", e);
            }
        }, err => {
            console.log(err);
        }, () => {
            // console.log("Complete");
        });
    }

    // File upload

    getUploadConfig() {
        var that = this;

        that._autoservice.getMOM({ "flag": "filebyid", "id": "29" }).subscribe(data => {
            that.uploadconfig.server = that.global.serviceurl + "uploads";
            that.uploadconfig.serverpath = that.global.serviceurl;
            that.uploadconfig.uploadurl = that.global.uploadurl;
            that.uploadconfig.filepath = that.global.filepath;
            that.uploadconfig.maxFilesize = data.data[0]._filesize;
            that.uploadconfig.acceptedFiles = data.data[0]._filetype;
        }, err => {
            console.log("Error");
        }, () => {
            console.log("Complete");
        })
    }

    onUpload(event) {
        var that = this;
        var imgfile = [];
        that.uploadPhotoDT = [];

        imgfile = JSON.parse(event.xhr.response);

        console.log(imgfile);

        for (var i = 0; i < imgfile.length; i++) {
            that.uploadPhotoDT.push({ "athurl": imgfile[i].path.replace(that.uploadconfig.filepath, "") })
        }
    }

    // Get File Size

    formatSizeUnits(bytes) {
        if (bytes >= 1073741824) {
            bytes = (bytes / 1073741824).toFixed(2) + ' GB';
        }
        else if (bytes >= 1048576) {
            bytes = (bytes / 1048576).toFixed(2) + ' MB';
        }
        else if (bytes >= 1024) {
            bytes = (bytes / 1024).toFixed(2) + ' KB';
        }
        else if (bytes > 1) {
            bytes = bytes + ' bytes';
        }
        else if (bytes == 1) {
            bytes = bytes + ' byte';
        }
        else {
            bytes = '0 byte';
        }

        return bytes;
    }

    removeFileUpload() {
        this.uploadPhotoDT.splice(0, 1);
    }

    // Clear Fields

    resetEmployeeFields() {
        var that = this;

        that.empid = 0;
        that.empcode = "";
        that.emppwd = "";
        that.empname = "";
        that.aadharno = "";
        that.mobileno1 = "";
        that.mobileno2 = "";
        that.email1 = "";
        that.email2 = "";
        that.address = "";
        that.country = "India";
        that.state = 0;
        that.city = 0;
        that.area = 0;
        that.pincode = 0;
    }

    // Save Data

    saveEmployeeInfo() {
        var that = this;

        if (that.enttid == 0) {
            that._msg.Show(messageType.error, "Error", "Select Entity");
            $(".enttid").focus();
        }
        else if (that.empcode == "") {
            that._msg.Show(messageType.error, "Error", "Enter emp Code");
            $(".empcode").focus();
        }
        else if (that.emppwd == "") {
            that._msg.Show(messageType.error, "Error", "Enter Password");
            $(".emppwd").focus();
        }
        else if (that.empname == "") {
            that._msg.Show(messageType.error, "Error", "Enter emp Name");
            $(".empname").focus();
        }
        else if (that.mobileno1 == "") {
            that._msg.Show(messageType.error, "Error", "Enter Mobile No");
            $(".mobileno1").focus();
        }
        else if (that.address == "") {
            that._msg.Show(messageType.error, "Error", "Enter Address");
            $(".address").focus();
        }
        else {
            commonfun.loader();

            var saveemp = {
                "empid": that.empid,
                "loginid": that.loginid,
                "empcode": that.empcode,
                "emppwd": that.emppwd,
                "empname": that.empname,
                "aadharno": that.aadharno,
                "licenseno": that.licenseno,
                "filepath": that.uploadPhotoDT.length > 0 ? that.uploadPhotoDT[0].athurl : "",
                "mobileno1": that.mobileno1,
                "mobileno2": that.mobileno2,
                "email1": that.email1,
                "email2": that.email2,
                "address": that.address,
                "country": that.country,
                "state": that.state,
                "city": that.city,
                "area": that.area,
                "pincode": that.pincode.toString() == "" ? 0 : that.pincode,
                "enttid": that.enttid,
                "attachdocs": that.attachDocsDT,
                "remark1": that.remark1,
                "cuid": that.loginUser.ucode,
                "wsautoid": that._wsdetails.wsautoid,
                "isactive": that.isactive,
                "mode": ""
            }

            this._empservice.saveEmployeeInfo(saveemp).subscribe(data => {
                try {
                    var dataResult = data.data[0].funsave_employeeinfo;
                    var msg = dataResult.msg;
                    var msgid = dataResult.msgid;

                    if (msgid != "-1") {
                        that._msg.Show(messageType.success, "Success", msg);

                        if (msgid === "1") {
                            that.resetEmployeeFields();
                        }
                        else {
                            that.backViewData();
                        }
                    }
                    else {
                        that._msg.Show(messageType.error, "Error", msg);
                    }

                    commonfun.loaderhide();
                }
                catch (e) {
                    that._msg.Show(messageType.error, "Error", e);
                }
            }, err => {
                that._msg.Show(messageType.error, "Error", err);
                console.log(err);
                commonfun.loaderhide();
            }, () => {
                // console.log("Complete");
            });
        }
    }

    // Get emp Data

    getEmployeeDetails() {
        var that = this;
        commonfun.loader();

        that.subscribeParameters = that._routeParams.params.subscribe(params => {
            if (params['id'] !== undefined) {
                that.empid = params['id'];

                that._empservice.getEmployeeDetails({
                    "flag": "edit",
                    "id": that.empid,
                    "wsautoid": that._wsdetails.wsautoid
                }).subscribe(data => {
                    try {
                        var _empdata = data.data;

                        that.empid = _empdata[0].empid;
                        that.loginid = _empdata[0].loginid;
                        that.empcode = _empdata[0].empcode;
                        that.emppwd = _empdata[0].emppwd;
                        that.empname = _empdata[0].empname;

                        if (data.data[0].FilePath !== "") {
                            that.uploadPhotoDT.push({ "athurl": data.data[0].FilePath });
                        }

                        that.aadharno = _empdata[0].aadharno;
                        that.licenseno = _empdata[0].licenseno;
                        that.email1 = _empdata[0].email1;
                        that.email2 = _empdata[0].email2;
                        that.mobileno1 = _empdata[0].mobileno1;
                        that.mobileno2 = _empdata[0].mobileno2;
                        that.address = _empdata[0].address;
                        that.country = _empdata[0].country;
                        that.state = _empdata[0].state;
                        that.fillCityDropDown();
                        that.city = _empdata[0].city;
                        that.fillAreaDropDown();
                        that.area = _empdata[0].area;
                        that.pincode = _empdata[0].pincode;
                        that.enttid = _empdata[0].enttid;
                        that.enttname = _empdata[0].enttname;
                        that.remark1 = _empdata[0].remark1;
                        that.isactive = _empdata[0].isactive;
                        that.mode = _empdata[0].mode;;
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
            else {
                if (Cookie.get('_enttnm_') != null) {
                    that.enttid = parseInt(Cookie.get('_enttid_'));
                    that.enttname = Cookie.get('_enttnm_');
                }

                that.resetEmployeeFields();
                commonfun.loaderhide();
            }
        });
    }

    // Back For View Data

    backViewData() {
        this._router.navigate(['/master/employee']);
    }
}
