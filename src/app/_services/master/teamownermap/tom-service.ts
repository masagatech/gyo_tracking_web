import { Injectable } from '@angular/core';
import { DataService } from '../../dataconnect';
import { Router } from '@angular/router';

@Injectable()
export class TeamOwnershipMapService {
    constructor(private _dataserver: DataService, private _router: Router) { }

    getTeamOwnershipMap(req: any) {
        return this._dataserver.post("getTeamOwnershipMap", req)
    }

    saveTeamOwnershipMap(req: any) {
        return this._dataserver.post("saveTeamOwnershipMap", req)
    }
}