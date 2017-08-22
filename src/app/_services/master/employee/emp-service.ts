import { Injectable } from '@angular/core';
import { DataService } from '../../dataconnect';
import { Router } from '@angular/router';

@Injectable()
export class EmployeeService {
    constructor(private _dataserver: DataService, private _router: Router) { }

    getEmployeeDetails(req: any) {
        return this._dataserver.post("getEmployeeDetails", req)
    }

    saveEmployeeInfo(req: any) {
        return this._dataserver.post("saveEmployeeInfo", req)
    }

    updateEmployeeInfo(req: any) {
        return this._dataserver.post("updateEmployeeInfo", req)
    }

    getEmployeeAttendance(req: any) {
        return this._dataserver.post("getEmployeeAttendance", req)
    }

    getTeamWiseEmployeeReports(req: any) {
        return this._dataserver.post("getTeamWiseEmployeeReports", req)
    }
}