import { Injectable } from '@angular/core';
import { DataService } from '../../dataconnect';
import { Router } from '@angular/router';

@Injectable()
export class TeamEmployeeMapService {
    constructor(private _dataserver: DataService, private _router: Router) { }

    getTeamEmployeeMap(req: any) {
        return this._dataserver.post("getTeamEmployeeMap", req)
    }

    saveTeamEmployeeMap(req: any) {
        return this._dataserver.post("saveTeamEmployeeMap", req)
    }
}