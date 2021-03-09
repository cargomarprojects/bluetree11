
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from '../../core/services/global.service';


@Injectable({
    providedIn: 'root'
})
export class ParamDetService {
    constructor(
        private http2: HttpClient,
        private gs: GlobalService) {
    }

    List(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + "/api/Master/ParamDet/List", SearchData, this.gs.headerparam2('authorized'));
    }

    GetRecord(Record: any) {
        return this.http2.post<any>(this.gs.baseUrl + "/api/Master/ParamDet/GetRecord", Record, this.gs.headerparam2('authorized'));
    }

    Save(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + "/api/Master/ParamDet/Save", SearchData, this.gs.headerparam2('authorized'));
    }

}


