import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, BehaviorSubject } from 'rxjs';

import { GlobalService } from '../../core/services/global.service';
import { vm_Tbl_User_Userm,User_Userm_Model, Tbl_User_Userm }  from '../models/Tbl_User_Userm';
import { SearchQuery } from '../models/Tbl_User_Userm';
import { PageQuery } from '../../shared/models/pageQuery';


@Injectable({
    providedIn: 'root'
})
export class UserService {

    private mdata$ = new BehaviorSubject<User_Userm_Model>(null);
    get data$(): Observable<User_Userm_Model> {
        return this.mdata$.asObservable();
    }
    private record: User_Userm_Model;

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
        this.record = <User_Userm_Model>{
            errormessage: '',
            records: [],
            searchQuery: <SearchQuery>{ searchString: '' , deleted : false },
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

        this.record = <User_Userm_Model>{
            errormessage: '',
            records: [],
            searchQuery: <SearchQuery>{ searchString: '' , deleted : false },
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

    Search(_searchdata: any, type: string = '' ) {

        if (type == 'SEARCH') {
            this.record.searchQuery = _searchdata.searchQuery;
        }
        if (type == 'PAGE') {
            this.record.pageQuery = _searchdata.pageQuery;
        }

        var SearchData = { ...this.gs.UserInfo};
        SearchData.outputformat = 'SCREEN';
        SearchData.action = 'NEW';
        SearchData.pkid = this.id;
        SearchData.TYPE = '';
        SearchData.page_rowcount = this.gs.ROWS_TO_DISPLAY;
        SearchData.CODE = this.record.searchQuery.searchString;
        SearchData.REC_DELETED = (this.record.searchQuery.deleted) ? "Y" : "N";
        SearchData.ISADMIN =  (this.isAdmin) ? "Y" : "N";

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
            this.record = <User_Userm_Model>{
                records: [],
                errormessage: this.gs.getError(error),
            }
            this.mdata$.next(this.record);
        });
    }

    RefreshList(_rec: Tbl_User_Userm) {
        if (this.record.records == null)
            return;
        var REC = this.record.records.find(rec => rec.usr_pkid == _rec.usr_pkid);
        if (REC == null) {
            this.record.records.push(_rec);
        }
        else
        {
            REC.usr_code = _rec.usr_code;
            REC.usr_name = _rec.usr_name;
            REC.usr_islocked = _rec.usr_islocked  ;
            REC.usr_tel = _rec.usr_tel;
            REC.usr_mobile = _rec.usr_mobile;
            REC.usr_email = _rec.usr_email;
        }
    }
    
    List(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Userm/List', SearchData, this.gs.headerparam2('authorized'));
    }

    GetRecord(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Userm/GetRecord', SearchData, this.gs.headerparam2('authorized'));
    }

    Save(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Userm/Save', SearchData, this.gs.headerparam2('authorized'));
    }

    getCompanyList(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Auth/CompanyList', SearchData, this.gs.headerparam2('authorized'));
    }


}

