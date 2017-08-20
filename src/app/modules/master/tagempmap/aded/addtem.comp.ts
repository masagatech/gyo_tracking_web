import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { TeamEmployeeMapService, TagService } from '@services/master';
import { Cookie } from 'ng2-cookies/ng2-cookies';

declare var google: any;

@Component({
    templateUrl: 'addtem.comp.html',
    providers: [CommonService]
})

export class AddTagEmployeeMapComponent implements OnInit {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    disableentt: boolean = false;
    disabletag: boolean = false;

    temid: number = 0;

    tagDT: any = [];
    tagid: number = 0;
    tagnm: any = [];

    selectedPType: string = 'team';
    isteam: boolean = false;
    isemployee: boolean = false;

    teamDT: any = [];
    tmid: number = 0;
    tmnm: any = [];

    employeeDT: any = [];
    empid: number = 0;
    empname: any = [];

    employeeList: any = [];

    remark: string = "";

    private subscribeParameters: any;

    constructor(private _temservice: TeamEmployeeMapService, private _ptservice: TagService, private _routeParams: ActivatedRoute,
        private _router: Router, private _loginservice: LoginService, private _msg: MessageService, private _autoservice: CommonService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.hidewhenTeamOrEmployee();
    }

    public ngOnInit() {
        var that = this;

        setTimeout(function () {
            $(".enttname input").focus();
        }, 100);


        that.subscribeParameters = that._routeParams.params.subscribe(params => {
            if (params['id'] !== undefined) {
                var ptagid = params['id'];
                that.getTagEmployeeMap(ptagid);
            }
            else {
                that.resetTagEmployeeMapFields();
                commonfun.loaderhide();
            }
        });
    }

    // Auto Completed Tag

    getTagData(event) {
        let query = event.query;

        this._autoservice.getAutoData({
            "flag": "tag",
            "enttid": this._enttdetails.enttid,
            "wsautoid": this._enttdetails.wsautoid,
            "search": query
        }).subscribe((data) => {
            this.tagDT = data.data;
        }, err => {
            this._msg.Show(messageType.error, "Error", err);
        }, () => {

        });
    }

    // Selected Tag

    selectTagData(event) {
        this.tagid = event.value;
        this.getTagEmployeeMap(this.tagid);
    }

    // Hide When Team / Employee

    hidewhenTeamOrEmployee() {
        if (this.selectedPType == "team") {
            this.isteam = true;
            this.isemployee = false;
        }
        else if (this.selectedPType == "employee") {
            this.isteam = false;
            this.isemployee = true;
        }

        this.employeeList = [];
    }

    // Auto Completed Team

    getTeamData(event) {
        let query = event.query;

        this._autoservice.getAutoData({
            "flag": "team",
            "uid": this.loginUser.uid,
            "ucode": this.loginUser.ucode,
            "utype": this.loginUser.utype,
            "enttid": this._enttdetails.enttid,
            "issysadmin": this.loginUser.issysadmin,
            "wsautoid": this._enttdetails.wsautoid,
            "search": query
        }).subscribe((data) => {
            this.teamDT = data.data;
        }, err => {
            this._msg.Show(messageType.error, "Error", err);
        }, () => {

        });
    }

    // Selected Team

    selectTeamData(event) {
        this.tmid = event.value;
        this.getTeamEmployeeMap();
    }

    // Get Team Employee Data

    getTeamEmployeeMap() {
        var that = this;
        commonfun.loader("#divTeam");

        that._temservice.getTeamEmployeeMap({
            "flag": "employee",
            "enttid": that._enttdetails.enttid,
            "tmid": that.tmid,
            "wsautoid": that._enttdetails.wsautoid
        }).subscribe(data => {
            try {
                if (data.data.length > 0) {
                    that.employeeList = data.data;
                }
                else {
                    that._msg.Show(messageType.error, "Error", "There are no Employee");
                    that.tmid = 0;
                    that.tmnm = [];
                    that.employeeList = [];
                    $(".tmnm input").focus();
                }
            }
            catch (e) {
                that._msg.Show(messageType.error, "Error", e);
            }

            commonfun.loaderhide("#divTeam");
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
            console.log(err);
            commonfun.loaderhide("#divTeam");
        }, () => {

        })
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
        this.addEmployeeList();

        $(".selectall").is(':checked');
        this.selectAndDeselectAllCheckboxes();
    }

    private selectAndDeselectAllCheckboxes() {
        if ($(".selectall").is(':checked')) {
            $(".allcheckboxes input[type=checkbox]").prop('checked', true);
            console.log("1");
        }
        else {
            $(".allcheckboxes input[type=checkbox]").prop('checked', false);
            console.log("2");
        }
    }

    // Check Duplicate Employee

    isDuplicateEmployee() {
        var that = this;

        for (var i = 0; i < that.employeeList.length; i++) {
            var field = that.employeeList[i];

            if (field.empid == this.empid) {
                this._msg.Show(messageType.error, "Error", "Duplicate Employee not Allowed");
                return true;
            }
        }

        return false;
    }

    // Read Get Employee

    addEmployeeList() {
        var that = this;
        commonfun.loader("#divEmployee");

        var duplicateEmployee = that.isDuplicateEmployee();

        if (!duplicateEmployee) {
            that.employeeList.push({ "empid": that.empname.value, "empname": that.empname.label });
        }

        that.empid = 0;
        that.empname = [];
        $(".empname input").focus();
        commonfun.loaderhide("#divEmployee");
    }

    // Clear Fields

    resetTagEmployeeMapFields() {
        var that = this;

        that.tmid = 0;
        that.tmnm = [];
        that.empid = 0;
        that.empname = [];
        that.remark = "";
        that.employeeList = [];
    }

    // Selected Employee

    getSelectedEmployee() {
        var _giverights = [];
        var emplist = null;
        var selemp = "";
        var selemplist = {};

        for (var i = 0; i <= this.employeeList.length - 1; i++) {
            emplist = null;
            emplist = this.employeeList[i];

            if (emplist !== null) {
                $("#emp" + emplist.empid).find("input[type=checkbox]").each(function () {
                    selemp += (this.checked ? $(this).val() + "," : "");
                });

                selemplist = "{" + selemp.slice(0, -1) + "}";
            }
        }

        return selemplist;
    }

    // Save Data

    isValidationTagEmployeeMap() {
        var that = this;

        if (that.tagid == 0) {
            that._msg.Show(messageType.error, "Error", "Enter Tag");
            $(".tagnm input").focus();
            return false;
        }
        else if (that.selectedPType == "team") {
            if (that.tmid == 0) {
                that._msg.Show(messageType.error, "Error", "Enter Team");
                $(".tmnm input").focus();
                return false;
            }
        }
        else if (that.selectedPType == "employee") {
            if (that.employeeList.length == 0) {
                that._msg.Show(messageType.error, "Error", "Enter Employee");
                $(".empname input").focus();
                return false;
            }
        }

        return true;
    }

    saveTagEmployeeMap() {
        var that = this;
        var isvalidpt: boolean = false;
        var selemplist = {};

        isvalidpt = that.isValidationTagEmployeeMap();

        if (isvalidpt) {
            selemplist = that.getSelectedEmployee();
            console.log(selemplist);

            if (selemplist == "{}") {
                that._msg.Show(messageType.error, "Error", "Select Atleast 1 Employee");
                $(".frmtm").focus();
            }
            else {
                commonfun.loader();

                var saveemp = {
                    "temid": that.temid,
                    "enttid": that._enttdetails.enttid,
                    "tagid": that.tagid,
                    "empid": selemplist,
                    "emptype": that.selectedPType,
                    "tmid": that.tmid,
                    "remark": that.remark,
                    "cuid": that.loginUser.ucode,
                    "wsautoid": that._enttdetails.wsautoid
                }

                this._ptservice.saveTagEmployeeMap(saveemp).subscribe(data => {
                    try {
                        var dataResult = data.data[0].funsave_tagempmap;
                        var msg = dataResult.msg;
                        var msgid = dataResult.msgid;

                        if (msgid != "-1") {
                            that._msg.Show(messageType.success, "Success", msg);

                            if (msgid === "1") {
                                that.resetTagEmployeeMapFields();
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
    }

    // Get Tag Employee Map

    getTagEmployeeMap(ptagid) {
        var that = this;
        commonfun.loader();

        that.disableentt = true;
        that.disabletag = true;

        that._ptservice.getTagEmployeeMap({
            "flag": "edit",
            "tagid": ptagid,
            "wsautoid": that._enttdetails.wsautoid
        }).subscribe(data => {
            try {
                that.temid = data.data[0].temid;
                that.tagid = data.data[0].tagid;
                that.tagnm.value = data.data[0].tagid;
                that.tagnm.label = data.data[0].tagnm;
                that.selectedPType = data.data[0].emptype;
                that.tmid = data.data[0].tmid;
                that.tmnm.value = data.data[0].tmid;
                that.tmnm.label = data.data[0].tmnm;
                that.remark = data.data[0].remark;
                that.employeeList = data.data[0].empdata;
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

    // Back For View Data

    backViewData() {
        this._router.navigate(['/master/tagempmap']);
    }
}
