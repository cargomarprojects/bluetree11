import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from '../../core/services/global.service';

@Injectable({
    providedIn: 'root'
})
export class BookingService {
 
    constructor(
        private http2: HttpClient,
        private gs: GlobalService
    ) {}


    GetRecord(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/SeaExport/Booking/GetRecord', SearchData, this.gs.headerparam2('authorized'));
    }

    Save(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/SeaExport/Booking/Save', SearchData, this.gs.headerparam2('authorized'));
    }
    
    BookingReport(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/SeaExport/Booking/BookingReport', SearchData, this.gs.headerparam2('authorized'));
    }


    
}