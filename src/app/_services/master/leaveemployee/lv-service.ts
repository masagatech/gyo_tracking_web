import { Injectable } from '@angular/core';
import { DataService } from '../../dataconnect';
import { Router } from '@angular/router';

@Injectable()
export class LeaveEmployeeService {
    constructor(private _dataserver: DataService, private _router: Router) { }

    getLeaveEmployee(req: any) {
        return this._dataserver.post("getLeaveEmployee", req)
    }

    saveLeaveEmployee(req: any) {
        return this._dataserver.post("saveLeaveEmployee", req)
    }
}