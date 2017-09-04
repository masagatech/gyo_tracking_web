import { Injectable } from '@angular/core';
import { DataService } from '../../dataconnect';
import { Router } from '@angular/router';

@Injectable()
export class TagService {
    constructor(private _dataserver: DataService, private _router: Router) { }

    getTagDetails(req: any) {
        return this._dataserver.post("getTagDetails", req)
    }

    saveTagInfo(req: any) {
        return this._dataserver.post("saveTagInfo", req)
    }

    getTagEmployeeMap(req: any) {
        return this._dataserver.post("getTagEmployeeMap", req)
    }

    saveTagEmployeeMap(req: any) {
        return this._dataserver.post("saveTagEmployeeMap", req)
    }
}