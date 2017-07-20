import { Injectable } from '@angular/core';
import { DataService } from '../../dataconnect';
import { Router } from '@angular/router';

@Injectable()
export class PushTagService {
    constructor(private _dataserver: DataService, private _router: Router) { }

    getPushTagDetails(req: any) {
        return this._dataserver.post("getPushTagDetails", req)
    }

    savePushTagInfo(req: any) {
        return this._dataserver.post("savePushTagInfo", req)
    }
}