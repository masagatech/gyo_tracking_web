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

    getPushTagDetails(req: any) {
        return this._dataserver.post("getPushTagDetails", req)
    }

    savePushTagInfo(req: any) {
        return this._dataserver.post("savePushTagInfo", req)
    }
}