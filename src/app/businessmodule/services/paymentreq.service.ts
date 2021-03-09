import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from '../../core/services/global.service';

@Injectable({
    providedIn: 'root'
})
export class PaymentReqService {

    constructor(
        private http2: HttpClient,
        private gs: GlobalService) {
    }

    List(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/LoginService/PaymentReqPage/List', SearchData, this.gs.headerparam2('authorized'));
    }

  
    Save(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/LoginService/PaymentReqPage/Save', SearchData, this.gs.headerparam2('authorized'));
    }

    DeleteRecord(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/LoginService/PaymentReqPage/DeleteRecord', SearchData, this.gs.headerparam2('authorized'));
    }
}

