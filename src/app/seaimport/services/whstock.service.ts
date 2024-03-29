import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { GlobalService } from '../../core/services/global.service';

@Injectable({
    providedIn: 'root'
})
export class WhStockService {

    constructor(
        private http2: HttpClient,
        private gs: GlobalService
    ) { }

    GetRecord(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/SeaImport/WhStock/GetRecord', SearchData, this.gs.headerparam2('authorized'));
    }

    Save(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/SeaImport/WhStock/Save', SearchData, this.gs.headerparam2('authorized'));
    }

    TransferData(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Warehouse/Inward/TransferData', SearchData, this.gs.headerparam2('authorized'));
    }
}
