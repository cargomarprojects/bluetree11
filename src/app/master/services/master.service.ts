import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from '../../core/services/global.service';


@Injectable({
    providedIn: 'root'
})
export class ParamService {
    constructor(
        private http2: HttpClient,
        private gs: GlobalService) {
    }

    List(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + "/api/Master/Param/List", SearchData, this.gs.headerparam2('authorized'));
    }

    GetRecord(Record: any) {
        return this.http2.post<any>(this.gs.baseUrl + "/api/Master/Param/GetRecord", Record, this.gs.headerparam2('authorized'));
    }

    Save(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + "/api/Master/Param/Save", SearchData, this.gs.headerparam2('authorized'));
    }

}


