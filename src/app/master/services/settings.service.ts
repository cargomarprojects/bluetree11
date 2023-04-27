
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { GlobalService } from '../../core/services/global.service';

@Injectable({
    providedIn: 'root'
})
export class SettingsService {

    constructor(
        private http2: HttpClient,
        private gs: GlobalService
    ) { }

    List(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Master/Settings/List', SearchData, this.gs.headerparam2('authorized'));
    }
    Save(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Master/Settings/Save', SearchData, this.gs.headerparam2('authorized'));
    }
    
    MailServerList(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/MailServer/ServerList', SearchData, this.gs.headerparam2('authorized'));
    }

    
}
