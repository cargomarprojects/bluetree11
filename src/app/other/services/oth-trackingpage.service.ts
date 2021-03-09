
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { GlobalService } from '../../core/services/global.service';

@Injectable({
    providedIn: 'root'
})
export class OthTrackingPageService {

    constructor(
        private http2: HttpClient,
        private gs: GlobalService
    ) { }

    GetRecord(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Other/TrackingPage/GetRecord', SearchData, this.gs.headerparam2('authorized'));
    }

    Save(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Other/TrackingPage/Save', SearchData, this.gs.headerparam2('authorized'));
    }
    SaveMemo(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Other/TrackingPage/SaveMemo', SearchData, this.gs.headerparam2('authorized'));
    }
    DeleteRecord(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Other/TrackingPage/DeleteRecord', SearchData, this.gs.headerparam2('authorized'));
    }
}
