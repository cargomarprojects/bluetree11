import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, BehaviorSubject } from 'rxjs';

import { GlobalService } from '../../core/services/global.service';
import { vm_Tbl_Audit, Audit_Model, Tbl_Audit } from '../models/Tbl_Audit';
import { SearchQuery } from '../models/Tbl_Audit';
import { PageQuery } from '../../shared/models/pageQuery';


@Injectable({
    providedIn: 'root'
})
export class LogRegisterService {

    private mdata$ = new BehaviorSubject<Audit_Model>(null);
    get data$(): Observable<Audit_Model> {
        return this.mdata$.asObservable();
    }
    private record: Audit_Model;

    public id: string;
    public menuid: string;
    public param_type: string;

    public title: string;
    public isAdmin: boolean;
    public canAdd: boolean;
    public canEdit: boolean;
    public canSave: boolean;

    public initlialized: boolean;
    private appid ='';

    constructor(
        private http2: HttpClient,
        private gs: GlobalService
    ) { }

    public ClearInit() {
        this.record = <Audit_Model>{
            errormessage: '',
            records: [],
            searchQuery: <SearchQuery>{ searchString: '',fromdate: this.gs.getPreviousDate(this.gs.SEARCH_DATE_DIFF), todate: this.gs.defaultValues.today, searchtype: 'REFNO' },
            pageQuery: <PageQuery>{ action: 'NEW', page_count: 0, page_current: -1, page_rowcount: 0, page_rows: 30 }
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
        this.param_type = params.param_type;

        this.record = <Audit_Model>{
            errormessage: '',
            records: [],
            searchQuery: <SearchQuery>{ searchString: '',fromdate: this.gs.getPreviousDate(this.gs.SEARCH_DATE_DIFF), todate: this.gs.defaultValues.today, searchtype: 'REFNO' },
            pageQuery: <PageQuery>{ action: 'NEW', page_count: 0, page_current: -1, page_rowcount: 0, page_rows: 30 }
        };

        this.mdata$.next(this.record);

        this.isAdmin = this.gs.IsAdmin(this.menuid);
        this.title = this.gs.getTitle(this.menuid);
        this.canAdd = this.gs.canAdd(this.menuid);
        this.canEdit = this.gs.canEdit(this.menuid);
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
        SearchData.TYPE = this.param_type;
        SearchData.page_rowcount = this.gs.ROWS_TO_DISPLAY;
        SearchData.CODE = this.record.searchQuery.searchString;
        SearchData.SDATE = this.record.searchQuery.fromdate;
        SearchData.EDATE = this.record.searchQuery.todate;
        SearchData.SEARCH_TYPE = this.record.searchQuery.searchtype;        
        SearchData.page_count = 0;
        SearchData.page_rows = 30;
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
            this.record.errormessage = '';
            this.mdata$.next(this.record);
        }, error => {
            this.record = <Audit_Model>{
                records: [],
                errormessage: this.gs.getError(error),
            }
            this.mdata$.next(this.record);
        });
    }


    List(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Report/LogRegister', SearchData, this.gs.headerparam2('authorized'));
    }


}
