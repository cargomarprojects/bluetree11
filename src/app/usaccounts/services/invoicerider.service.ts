import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from '../../core/services/global.service';

@Injectable({
    providedIn: 'root'
})
export class InvoiceRiderService {

    constructor(
        private http2: HttpClient,
        private gs: GlobalService) {
    }

    List(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/USAccounts/InvoiceRiderPage/List', SearchData, this.gs.headerparam2('authorized'));
    }

    GetRecord(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/USAccounts/InvoiceRiderPage/GetRecord', SearchData, this.gs.headerparam2('authorized'));
    }

    Save(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/USAccounts/InvoiceRiderPage/Save', SearchData, this.gs.headerparam2('authorized'));
    }

    DeleteRecord(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/USAccounts/InvoiceRiderPage/DeleteRecord', SearchData, this.gs.headerparam2('authorized'));
    }

    LoadMblContainer(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/USAccounts/InvoiceRiderPage/LoadMblContainer', SearchData, this.gs.headerparam2('authorized'));
    }
}
