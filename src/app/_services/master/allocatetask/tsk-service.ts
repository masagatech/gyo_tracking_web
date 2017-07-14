import { Injectable } from '@angular/core';
import { DataService } from '../../dataconnect';
import { Router } from '@angular/router';

@Injectable()
export class AllocateTaskService {
    constructor(private _dataserver: DataService, private _router: Router) { }

    getAllocateTask(req: any) {
        return this._dataserver.post("getAllocateTask", req)
    }

    saveAllocateTask(req: any) {
        return this._dataserver.post("saveAllocateTask", req)
    }
}