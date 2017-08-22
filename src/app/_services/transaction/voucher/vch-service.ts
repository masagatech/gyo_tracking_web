import { Injectable } from '@angular/core';
import { DataService } from '../../dataconnect';
import { Router } from '@angular/router';

@Injectable()
export class VoucherService {
    constructor(private _dataserver: DataService, private _router: Router) { }

    getVoucherDetails(req: any) {
        return this._dataserver.post("getVoucherDetails", req)
    }

    saveVoucherInfo(req: any) {
        return this._dataserver.post("saveVoucherInfo", req)
    }

    saveVoucherApproval(req: any) {
        return this._dataserver.post("saveVoucherApproval", req)
    }
}