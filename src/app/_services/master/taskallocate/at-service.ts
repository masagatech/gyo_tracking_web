import { Injectable } from '@angular/core';
import { DataService } from '../../dataconnect';
import { Router } from '@angular/router';

@Injectable()
export class TaskAllocateService {
    constructor(private _dataserver: DataService, private _router: Router) { }

    getTaskAllocate(req: any) {
        return this._dataserver.post("getTaskAllocate", req)
    }

    saveTaskAllocate(req: any) {
        return this._dataserver.post("saveTaskAllocate", req)
    }

    getTaskReports(req: any) {
        return this._dataserver.post("getTaskReports", req)
    }
}