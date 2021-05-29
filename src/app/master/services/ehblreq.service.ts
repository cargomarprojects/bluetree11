
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from '../../core/services/global.service';
import { Tbl_cargo_ehbld,  vm_Tbl_cargo_ehbl } from '../models/Tbl_cargo_ehbl';
 

@Injectable({
    providedIn: 'root'
})
export class EhblReqService {
   

    constructor(
        private http2: HttpClient,
        private gs: GlobalService
    ) { }

    
    List(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Master/EhblReq/List', SearchData, this.gs.headerparam2('authorized'));
    }

    GetRecord(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Master/EhblReq/GetRecord', SearchData, this.gs.headerparam2('authorized'));
    }

    Save(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Master/EhblReq/Save', SearchData, this.gs.headerparam2('authorized'));
    }
    
    Approve(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Master/EhblReq/Approve', SearchData, this.gs.headerparam2('authorized'));
    }

    DeleteRecord(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Master/EhblReq/DeleteRecord', SearchData, this.gs.headerparam2('authorized'));
    }
    GetBalanceBL(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Master/EhblReq/GetBalanceBL', SearchData, this.gs.headerparam2('authorized'));
    }
    GenerateValid(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Master/EhblReq/GenerateValid', SearchData, this.gs.headerparam2('authorized'));
    }
}
