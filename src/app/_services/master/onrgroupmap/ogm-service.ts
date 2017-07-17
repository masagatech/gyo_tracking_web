import { Injectable } from '@angular/core';
import { DataService } from '../../dataconnect';
import { Router } from '@angular/router';

@Injectable()
export class OwnershipTeamMapService {
    constructor(private _dataserver: DataService, private _router: Router) { }

    getOwnerTeamMap(req: any) {
        return this._dataserver.post("getOwnerGroupMap", req)
    }

    saveOwnerTeamMap(req: any) {
        return this._dataserver.post("saveOwnerGroupMap", req)
    }
}