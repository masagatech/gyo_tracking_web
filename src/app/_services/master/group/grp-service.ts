import { Injectable } from '@angular/core';
import { DataService } from '../../dataconnect';
import { Router } from '@angular/router';

@Injectable()
export class GroupService {
    constructor(private _dataserver: DataService, private _router: Router) { }

    getGroupDetails(req: any) {
        return this._dataserver.post("getGroupDetails", req)
    }

    saveGroupInfo(req: any) {
        return this._dataserver.post("saveGroupInfo", req)
    }
}