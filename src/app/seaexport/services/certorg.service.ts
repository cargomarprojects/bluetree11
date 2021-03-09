
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from '../../core/services/global.service';

@Injectable({
    providedIn: 'root'
})
export class CertOrgService {
 
    constructor(
        private http2: HttpClient,
        private gs: GlobalService
    ) {}

    GetRecord(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/SeaExport/CertOrgPage/GetRecord', SearchData, this.gs.headerparam2('authorized'));
    }

    Save(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/SeaExport/CertOrgPage/Save', SearchData, this.gs.headerparam2('authorized'));
    }

    GetContainer(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/SeaExport/Common/GetContainer', SearchData, this.gs.headerparam2('authorized'));
    }    

    MblReport(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/SeaExport/CertOrgPage/MblReport', SearchData, this.gs.headerparam2('authorized'));
    }
    
}