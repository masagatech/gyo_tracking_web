import { Injectable } from '@angular/core';
import { DataService } from '../../dataconnect';
import { Router } from '@angular/router';

@Injectable()
export class EmpGroupMapService {
    constructor(private _dataserver: DataService, private _router: Router) { }

    getEmpGroupMap(req: any) {
        return this._dataserver.post("getEmpGroupMap", req)
    }

    saveEmpGroupMap(req: any) {
        return this._dataserver.post("saveEmpGroupMap", req)
    }
}