
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from '../../core/services/global.service';
import { Tbl_cargo_ehbld,  vm_Tbl_cargo_ehbl } from '../models/Tbl_cargo_ehbl';
 

@Injectable({
    providedIn: 'root'
})
export class EhblService {
   

    constructor(
        private http2: HttpClient,
        private gs: GlobalService
    ) { }

    
    List(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Master/Ehbl/List', SearchData, this.gs.headerparam2('authorized'));
    }

    GetRecord(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Master/Ehbl/GetRecord', SearchData, this.gs.headerparam2('authorized'));
    }

    Save(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Master/Ehbl/Save', SearchData, this.gs.headerparam2('authorized'));
    }

    SavePendingNos(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Master/Ehbl/SavePendingNos', SearchData, this.gs.headerparam2('authorized'));
    }
}
