import { Injectable } from '@angular/core';
import { DataService } from '../../dataconnect';
import { Router } from '@angular/router';

@Injectable()
export class LoginLogService {
    constructor(private _dataserver: DataService, private _router: Router) { }

    getLoginlogDetails(req: any) {
        return this._dataserver.post("getLoginlogDetails", req)
    }

    saveLoginlogInfo(req: any) {
        return this._dataserver.post("saveLoginlogInfo", req)
    }
}