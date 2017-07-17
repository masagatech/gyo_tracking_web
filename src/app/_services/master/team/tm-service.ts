import { Injectable } from '@angular/core';
import { DataService } from '../../dataconnect';
import { Router } from '@angular/router';

@Injectable()
export class TeamService {
    constructor(private _dataserver: DataService, private _router: Router) { }

    getTeamDetails(req: any) {
        return this._dataserver.post("getTeamDetails", req)
    }

    saveTeamInfo(req: any) {
        return this._dataserver.post("saveTeamInfo", req)
    }
}