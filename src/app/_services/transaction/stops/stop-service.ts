import { Injectable } from '@angular/core';
import { DataService } from '../../dataconnect';
import { Router } from '@angular/router';

@Injectable()
export class StopsReportsService {
    constructor(private _dataserver: DataService, private _router: Router) { }

    getTripStops(req: any) {
        return this._dataserver.post("getTripStops", req)
    }
}