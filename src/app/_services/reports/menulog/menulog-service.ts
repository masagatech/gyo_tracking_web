import { Injectable } from '@angular/core';
import { DataService } from '../../dataconnect';
import { Router } from '@angular/router';

@Injectable()
export class MenuLogReportsService {
    constructor(private _dataserver: DataService, private _router: Router) { }

    getMenuLog(req: any) {
        return this._dataserver.post("getMenuLog", req)
    }

    saveMenuLog(req: any) {
        return this._dataserver.post("saveMenuLog", req)
    }
}

