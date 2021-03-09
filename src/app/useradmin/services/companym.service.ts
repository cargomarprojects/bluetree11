import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, BehaviorSubject } from 'rxjs';

import { GlobalService } from '../../core/services/global.service';
import { vm_Tbl_User_Companym,User_Companym_Model, Tbl_User_Companym }  from '../models/Tbl_User_Companym';
import { SearchQuery } from '../models/Tbl_User_Companym';
import { PageQuery } from '../../shared/models/pageQuery';


@Injectable({
    providedIn: 'root'
})
export class CompanyService {

    private mdata$ = new BehaviorSubject<User_Companym_Model>(null);
    get data$(): Observable<User_Companym_Model> {
        return this.mdata$.asObservable();
    }
    private record: User_Companym_Model;

    public id: string;
    public menuid: string;
    public param_type: string;

    public title: string;
    public isAdmin: boolean;
    public canAdd: boolean;
    public canEdit: boolean;
    public canSave: boolean;

    public initlialized: boolean;
    private LSESSION = 0;

    constructor(
        private http2: HttpClient,
        private gs: GlobalService
    ) { }

    public ClearInit() {
        this.record = <User_Companym_Model>{
            errormessage: '',
            records: [],
            searchQuery: <SearchQuery>{ searchString: ''},
            pageQuery: <PageQuery>{ action: 'NEW', page_count: 0, page_current: -1, page_rowcount: 0, page_rows: 0 }
        };
        this.mdata$.next(this.record);
    }
    
    public init(params: any) {
        if (this.LSESSION < this.gs.GSESSION) {
            this.LSESSION = this.gs.GSESSION;
            this.initlialized = false;
        }
        if (this.initlialized)
            return;

        this.id = params.id;
        this.menuid = params.id;
        this.param_type = params.param_type;

        this.record = <User_Companym_Model>{
            errormessage: '',
            records: [],
            searchQuery: <SearchQuery>{ searchString: ''},
            pageQuery: <PageQuery>{ action: 'NEW', page_count: 0, page_current: -1, page_rowcount: 0, page_rows: 0 }
        };

        this.mdata$.next(this.record);

        this.isAdmin = this.gs.IsAdmin(this.menuid);
        this.title = this.gs.getTitle(this.menuid);
        this.canAdd = this.gs.canAdd(this.menuid);
        this.canEdit = this.gs.canEdit(this.menuid);
        this.canSave = this.canAdd || this.canEdit;

        this.initlialized = true;

    }

    Search(_searchdata: any, type: string = '', catg : string ) {

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
        SearchData.TYPE = catg;
        SearchData.page_rowcount = this.gs.ROWS_TO_DISPLAY;
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
            this.record.records = response.list;
            this.mdata$.next(this.record);
        }, error => {
            this.record = <User_Companym_Model>{
                records: [],
                errormessage: this.gs.getError(error),
            }
            this.mdata$.next(this.record);
        });
    }

    RefreshList(_rec: Tbl_User_Companym) {
        if (this.record.records == null)
            return;
        var REC = this.record.records.find(rec => rec.comp_pkid == _rec.comp_pkid);
        if (REC == null) {
            this.record.records.push(_rec);
        }
        else
        {
            REC.comp_code = _rec.comp_code;
            REC.comp_name = _rec.comp_name;
            REC.comp_add1 = _rec.comp_add1;
            REC.comp_add2 = _rec.comp_add2;
            REC.comp_add3 = _rec.comp_add3;
            REC.comp_add4 = _rec.comp_add4;
            REC.comp_order = _rec.comp_order;
            REC.parent_name = _rec.parent_name;
        }
    }
    
    List(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Companym/List', SearchData, this.gs.headerparam2('authorized'));
    }

    GetRecord(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Companym/GetRecord', SearchData, this.gs.headerparam2('authorized'));
    }

    Save(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Companym/Save', SearchData, this.gs.headerparam2('authorized'));
    }

    getCompanyList(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Auth/CompanyList', SearchData, this.gs.headerparam2('authorized'));
    }


}
