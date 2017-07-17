import { Injectable } from '@angular/core';
import { DataService } from '../dataconnect';
import { Router } from '@angular/router';

@Injectable()
export class ReportsService {
    constructor(private _dataserver: DataService, private _router: Router) { }

    getAttendanceReports(req: any) {
        return this._dataserver.post("getAttendanceReports", req)
    }

    getTeamWiseEmployeeReports(req: any) {
        return this._dataserver.post("getTeamWiseEmployeeReports", req)
    }

    getSpeedVialationReports(req: any) {
        return this._dataserver.post("getSpeedVialationReports", req)
    }
}