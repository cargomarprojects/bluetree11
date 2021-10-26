import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { GlobalService } from '../../core/services/global.service';
import { SearchTable } from '../models/searchtable';

@Injectable({
  providedIn: 'root'
})
export class GenService {

  constructor(
    private http2: HttpClient,
    private gs: GlobalService) {
  }


  UpdateOsRemarks(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Accounts/Report/UpdateOsRemarks', SearchData, this.gs.headerparam2('authorized'));
  }

  GenerateXmlEdiMexico(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Xml/XmlEdi/GenerateXmlEdiMexico', SearchData, this.gs.headerparam2('authorized'));
  }

  GenRemarksGet(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Auth/GenRemarksGet', SearchData, this.gs.headerparam2('authorized'));
  }
  
  GenRemarksSave(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Auth/GenRemarksSave', SearchData, this.gs.headerparam2('authorized'));
  }
}

