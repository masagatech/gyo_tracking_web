import { Injectable } from '@angular/core';
import { DataService } from '../../dataconnect';
import { Router } from '@angular/router';

@Injectable()
export class EmployeeLeaveService {
    constructor(private _dataserver: DataService, private _router: Router) { }

    saveEmployeeLeave(req: any) {
        return this._dataserver.post("saveEmployeeLeave", req)
    }

    getEmployeeLeave(req: any) {
        return this._dataserver.post("getEmployeeLeave", req)
    }

    saveEmployeeLeaveApproval(req: any) {
        return this._dataserver.post("saveEmployeeLeaveApproval", req)
    }

    getEmployeeLeaveReports(req: any) {
        return this._dataserver.post("getEmployeeLeaveReports", req)
    }
}