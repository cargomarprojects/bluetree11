
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from '../../core/services/global.service';

@Injectable({
    providedIn: 'root'
})
export class MawbPageService {
 
    constructor(
        private http2: HttpClient,
        private gs: GlobalService
    ) {}

    GetRecord(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/AirExport/MawbPage/GetRecord', SearchData, this.gs.headerparam2('authorized'));
    }

    Save(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/AirExport/MawbPage/Save', SearchData, this.gs.headerparam2('authorized'));
    }

    GetManifestRecord(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/AirExport/MawbPage/GetManifestRecord', SearchData, this.gs.headerparam2('authorized'));
    }
    
}