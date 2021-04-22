
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { GlobalService } from '../../core/services/global.service';

@Injectable({
    providedIn: 'root'
})
export class FormatPageService {

    constructor(
        private http2: HttpClient,
        private gs: GlobalService
    ) { }

    List(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Master/FormatPage/List', SearchData, this.gs.headerparam2('authorized'));
    }

    GetFormats(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Master/FormatPage/GetFormats', SearchData, this.gs.headerparam2('authorized'));
    }

    GetRecord(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Master/FormatPage/GetRecord', SearchData, this.gs.headerparam2('authorized'));
    }

    Save(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Master/FormatPage/Save', SearchData, this.gs.headerparam2('authorized'));
    }
    
    DeleteRecord(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Master/FormatPage/DeleteRecord', SearchData, this.gs.headerparam2('authorized'));
    }
}
