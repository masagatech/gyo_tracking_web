import { Injectable } from '@angular/core';
import { DataService } from '../../dataconnect';
import { Router } from '@angular/router';

@Injectable()
export class OwnershipGroupMapService {
    constructor(private _dataserver: DataService, private _router: Router) { }

    getOwnerGroupMap(req: any) {
        return this._dataserver.post("getOwnerGroupMap", req)
    }

    saveOwnerGroupMap(req: any) {
        return this._dataserver.post("saveOwnerGroupMap", req)
    }
}