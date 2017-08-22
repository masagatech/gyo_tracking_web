import { Injectable } from '@angular/core';
import { DataService } from '../../dataconnect';
import { Router } from '@angular/router';

@Injectable()
export class TripReportsService {
    constructor(private _dataserver: DataService, private _router: Router) { }

    getTripReports(req: any) {
        return this._dataserver.post("getTripReports", req)
    }
}