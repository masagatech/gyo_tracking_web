import { Injectable } from '@angular/core';
import { DataService } from '../../dataconnect';
import { Router } from '@angular/router';

@Injectable()
export class TaskNatureService {
    constructor(private _dataserver: DataService, private _router: Router) { }

    getTaskNature(req: any) {
        return this._dataserver.post("getTaskNature", req)
    }

    saveTaskNature(req: any) {
        return this._dataserver.post("saveTaskNature", req)
    }
}