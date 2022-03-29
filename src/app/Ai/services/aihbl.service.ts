import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, BehaviorSubject } from 'rxjs';

import { GlobalService } from '../../core/services/global.service';
import { vm_Tbl_Ai_Hblm, Ai_Hblm_Model, Tbl_Ai_Hblm } from '../models/Tbl_ai_hbl';
import { SearchQuery } from '../models/Tbl_ai_hbl';
import { PageQuery } from '../../shared/models/pageQuery';



@Injectable({
    providedIn: 'root'
})
export class AiHblService {

    private mdata$ = new BehaviorSubject<Ai_Hblm_Model>(null);
    get data$(): Observable<Ai_Hblm_Model> {
        return this.mdata$.asObservable();
    }
    private record: Ai_Hblm_Model;

    public id: string;
    public menuid: string;
    public file_type: string = '';

    public title: string;
    public isAdmin: boolean;
    public canAdd: boolean;
    public canEdit: boolean;
    public canSave: boolean;
    public canDelete: boolean;

    public initlialized: boolean;
    private appid ='';

    constructor(
        private http2: HttpClient,
        private gs: GlobalService
    ) { }

    public selectRowId( rec : Tbl_Ai_Hblm){
        this.record.selectedId = rec.hbl_pkid;
    }
    public getRowId(){
        return this.record.selectedId;
    }

    public getRowSlNo(){
     
    }
    

    public ClearInit() {
        this.record = <Ai_Hblm_Model>{
            errormessage: '',
            records: [],
            searchQuery: <SearchQuery>{ searchString: '', file_type : this.file_type },
            pageQuery: <PageQuery>{ action: 'NEW', page_count: 0, page_current: -1, page_rowcount: 0, page_rows: 0 }
        };
        this.mdata$.next(this.record);
    }
    
    public init(params: any) {
        if (this.appid != this.gs.appid) {
            this.appid = this.gs.appid;
            this.initlialized = false;
        }
        if (this.initlialized)
            return;

        this.id = params.id;
        this.menuid = params.id;
        //this.file_type = params.param_type;

        this.record = <Ai_Hblm_Model>{
            errormessage: '',
            records: [],
            searchQuery: <SearchQuery>{ searchString: '' , file_type : this.file_type },
            pageQuery: <PageQuery>{ action: 'NEW', page_count: 0, page_current: -1, page_rowcount: 0, page_rows: 0 }
        };

        this.mdata$.next(this.record);

        this.isAdmin = this.gs.IsAdmin(this.menuid);
        this.title = this.gs.getTitle(this.menuid);
        this.canAdd = this.gs.canAdd(this.menuid);
        this.canEdit = this.gs.canEdit(this.menuid);
        this.canDelete = this.gs.canDelete(this.menuid);
        this.canSave = this.canAdd || this.canEdit;

        this.initlialized = true;

    }

    Search(_searchdata: any, type: string = '') {

        if (type == 'SEARCH') {
            this.record.searchQuery = _searchdata.searchQuery;
        }
        if (type == 'PAGE') {
            this.record.pageQuery = _searchdata.pageQuery;
        }

        var SearchData = this.gs.UserInfo;
        SearchData.outputformat = 'SCREEN';
        SearchData.action = 'NEW';
        SearchData.pkid = this.id;
        SearchData.TYPE = this.file_type;
        SearchData.page_rowcount = 10;
        SearchData.CODE = this.record.searchQuery.searchString;
        SearchData.page_count = 0;
        SearchData.page_rows = 0;
        SearchData.page_current = -1;

        if (type == 'PAGE') {
            SearchData.action = this.record.pageQuery.action;
            SearchData.page_count = this.record.pageQuery.page_count;
            SearchData.page_rows = this.record.pageQuery.page_rows;
            SearchData.page_current = this.record.pageQuery.page_current;;
        }

        this.List(SearchData).subscribe(response => {
            this.record.pageQuery = <PageQuery>{ action: 'NEW', page_rows: response.page_rows, page_count: response.page_count, page_current: response.page_current, page_rowcount: response.page_rowcount };
            this.record.selectedId= null;
            this.record.records = response.list;
            this.mdata$.next(this.record);
        }, error => {
            this.record.errormessage = this.gs.getError(error);
            this.mdata$.next(this.record);
            alert(this.record.errormessage);
        });
    }

    RefreshList(_rec: Tbl_Ai_Hblm) {
        if (this.record.records == null)
            return;
        var REC = this.record.records.find(rec => rec.hbl_pkid == _rec.hbl_pkid);
        if (REC == null) {
            this.record.records.push(_rec);
        }
        else {
            REC.hbl_shipper_name = _rec.hbl_shipper_name;
            REC.rec_created_by = _rec.rec_created_by;
        }
    }

    DeleteRow(_rec: Tbl_Ai_Hblm) {

        if (!confirm("DELETE " + _rec.hbl_shipper_name)) {
            return;
        }

        this.record.errormessage = '';
        var SearchData = this.gs.UserInfo;
        SearchData.pkid = _rec.hbl_pkid;
        this.DeleteRecord(SearchData)
            .subscribe(response => {
                if (response.retvalue == false) {
                    this.record.errormessage = response.error;
                    alert(this.record.errormessage);
                }
                else {
                    this.record.records.splice(this.record.records.findIndex(rec => rec.hbl_pkid == _rec.hbl_pkid), 1);
                }
                this.mdata$.next(this.record);
            }, error => {
                this.record.errormessage = this.gs.getError(error);
                this.mdata$.next(this.record);
                alert(this.record.errormessage);
            });
    }


    List(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/AwsAiHbl/List', SearchData, this.gs.headerparam2('authorized'));
    }


    GetRecord(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/AwsAiHbl/GetRecord', SearchData, this.gs.headerparam2('authorized'));
    }

    Save(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/AwsAiHbl/Save', SearchData, this.gs.headerparam2('authorized'));
    }

    DeleteRecord(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/AwsAiHbl/Delete', SearchData, this.gs.headerparam2('authorized'));
    }

    GenerateXml(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Xml/AiDocPage/GenerateXml', SearchData, this.gs.headerparam2('authorized'));
    }
}
