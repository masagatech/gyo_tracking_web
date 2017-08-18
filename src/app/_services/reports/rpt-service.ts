import { Injectable } from '@angular/core';
import { DataService } from '../dataconnect';
import { Router } from '@angular/router';

@Injectable()
export class ReportsService {
    constructor(private _dataserver: DataService, private _router: Router) { }

    getEmployeeAttendance(req: any) {
        return this._dataserver.post("getEmployeeAttendance", req)
    }

    getTeamWiseEmployeeReports(req: any) {
        return this._dataserver.post("getTeamWiseEmployeeReports", req)
    }

    getTripReports(req: any) {
        return this._dataserver.post("getTripReports", req)
    }
}