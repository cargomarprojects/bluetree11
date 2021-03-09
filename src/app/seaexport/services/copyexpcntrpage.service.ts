import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { GlobalService } from '../../core/services/global.service';

@Injectable({
    providedIn: 'root'
})
export class CopyExpCntrPageService {

    constructor(
        private http2: HttpClient,
        private gs: GlobalService
    ) { }

    List(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/SeaExport/CopyCntrPage/List', SearchData, this.gs.headerparam2('authorized'));
    }

    Save(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/SeaExport/CopyCntrPage/Save', SearchData, this.gs.headerparam2('authorized'));
    }
}
