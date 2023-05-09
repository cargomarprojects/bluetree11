import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { GlobalService } from '../../core/services/global.service';
import { SearchTable } from '../models/searchtable';

@Injectable({
  providedIn: 'root'
})
export class LovService {

  public sortcol: string = 'files_created_date';
  public sortorder: boolean = true;

  constructor(
    private http2: HttpClient,
    private gs: GlobalService) { }

  getSortCol() {
    return this.sortcol;
  }
  getSortOrder() {
    return this.sortorder;
  }

  getIcon(col: string) {
    if (col == this.sortcol) {
      if (this.sortorder)
        return 'fa fa-arrow-down';
      else
        return 'fa fa-arrow-up';
    }
    else
      return null;
  }

  sort(col: string) {
    if (col == this.sortcol) {
      this.sortorder = !this.sortorder;
    }
    else {
      this.sortcol = col;
      this.sortorder = true;
    }
  }

  List(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Admin/Lov/List', SearchData, this.gs.headerparam2('authorized'));
  }

  FileUpload(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/General/UploadFiles', SearchData, this.gs.headerparam2('authorized'));
  }

  LoadDefault(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/General/LoadDefault', SearchData, this.gs.headerparam2('authorized'));
  }

  DocumentList(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Auth/DocumentList', SearchData, this.gs.headerparam2('authorized'));
  }

  DeleteRecord(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Auth/DeleteDocument', SearchData, this.gs.headerparam2('authorized'));
  }

  Save2S3(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/AwsAiDocs/Save2S3', SearchData, this.gs.headerparam2('authorized'));
  }

  StartExtractDataProcess(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/AwsAiDocs/StartExtractDataProcess', SearchData, this.gs.headerparam2('authorized'));
  }


  Save(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Auth/Save', SearchData, this.gs.headerparam2('authorized'));
  }

  GetEmailIds(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Auth/GetEmailIds', SearchData, this.gs.headerparam2('authorized'));
  }


}
