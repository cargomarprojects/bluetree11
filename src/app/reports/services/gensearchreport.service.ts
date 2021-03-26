import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { GlobalService } from '../../core/services/global.service';
import { TBL_GEN_SEARCH, GenSearchReportModel } from '../models/tbl_gen_search';
import { SearchQuery } from '../models/tbl_gen_search';
import { PageQuery } from '../../shared/models/pageQuery';
import { ElementSchemaRegistry } from '@angular/compiler';

@Injectable({
    providedIn: 'root'
})
export class GenSearchReportService {

    private mdata$ = new BehaviorSubject<GenSearchReportModel>(null);
    get data$(): Observable<GenSearchReportModel> {
        return this.mdata$.asObservable();
    }
    private record: GenSearchReportModel;

    public search_type: string = 'CONTAINER';

    public id: string;
    public menuid: string;
    public param_type: string;

    public title: string;
    public isAdmin: boolean;
    public canAdd: boolean;
    public canEdit: boolean;
    public canSave: boolean;
    public canDelete: boolean;

    public initlialized: boolean;
    private appid =''

    constructor(
        private http2: HttpClient,
        private gs: GlobalService
    ) { }

    public getSortCol() {
        return this.record.sortcol;
    }
    public getSortOrder() {
        return this.record.sortorder;
    }

    public getIcon(col: string) {
        if (col == this.record.sortcol) {
            if (this.record.sortorder)
                return 'fa fa-arrow-down';
            else
                return 'fa fa-arrow-up';
        }
        else
            return null;
    }

    public sort(col: string) {
        if (col == this.record.sortcol) {
            this.record.sortorder = !this.record.sortorder;
        }
        else {
            this.record.sortcol = col;
            this.record.sortorder = true;
        }
    }
    public ClearInit() {
        this.record = <GenSearchReportModel>{
            sortcol: this.search_type == "PARENT" ? 'gen_code' : 'mbl_refno',
            sortorder: true,
            errormessage: '',
            records: [],
            searchQuery: <SearchQuery>{ searchString: '', searchType: 'ADDRESS BOOK', searchDate: '', customerId: '', customerName: '' },
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
        this.param_type = params.param_type;

        this.record = <GenSearchReportModel>{
            sortcol: this.search_type == "PARENT" ? 'gen_code' : 'mbl_refno',
            sortorder: true,
            errormessage: '',
            records: [],
            searchQuery: <SearchQuery>{ searchString: '', searchType: 'ADDRESS BOOK', searchDate: '', customerId: '', customerName: '' },
            pageQuery: <PageQuery>{ action: 'NEW', page_count: 0, page_current: -1, page_rowcount: 0, page_rows: 0 }
        };

        this.mdata$.next(this.record);

        this.isAdmin = this.gs.IsAdmin(this.menuid);
        this.title = this.gs.getTitle(this.menuid);
        this.canAdd = this.gs.canAdd(this.menuid);
        this.canEdit = this.gs.canEdit(this.menuid);
        this.canSave = this.canAdd || this.canEdit;
        this.canDelete = this.gs.canDelete(this.menuid);

        this.initlialized = true;

    }

    Search(_searchdata: any, type: string = '') {
        this.record.errormessage = '';
        this.mdata$.next(this.record);
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
        SearchData.page_rowcount = this.gs.ROWS_TO_DISPLAY;

        SearchData.STYPE = this.record.searchQuery.searchType;
        SearchData.CUST_ID = this.record.searchQuery.customerId;
        if (SearchData.STYPE == "TB DIFFERENCE")
            SearchData.DATE = this.record.searchQuery.searchDate;
        else
            SearchData.DATE = '';

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
            this.record = <GenSearchReportModel>{
                records: [],
                errormessage: this.gs.getError(error),
            }
            this.mdata$.next(this.record);
        });
    }

    List(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Report/GenSearchReport/List', SearchData, this.gs.headerparam2('authorized'));
    }
}
