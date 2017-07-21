import { Injectable } from '@angular/core';
import { DataService } from '../../dataconnect';
import { Router } from '@angular/router';

@Injectable()
export class ExpenseService {
    constructor(private _dataserver: DataService, private _router: Router) { }

    getExpenseDetails(req: any) {
        return this._dataserver.post("getExpenseDetails", req)
    }

    saveExpenseInfo(req: any) {
        return this._dataserver.post("saveExpenseInfo", req)
    }
}