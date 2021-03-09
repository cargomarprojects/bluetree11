import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { GlobalService } from '../../core/services/global.service';
import { Tbl_cargo_general, OthGeneralModel } from '../models/tbl_cargo_general';
import { SearchQuery } from '../models/tbl_cargo_general';
import { PageQuery } from '../../shared/models/pageQuery';

@Injectable({
    providedIn: 'root'
})
export class AlertLogPageService {

    private mdata$ = new BehaviorSubject<OthGeneralModel>(null);
    get data$(): Observable<OthGeneralModel> {
        return this.mdata$.asObservable();
    }

    private record: OthGeneralModel;

    public handled_name: string;
    public id: string;
    public menuid: string;
    public param_type: string;

    public title: string;
    public isAdmin: boolean;
    public isCompany: boolean;

    public initlialized: boolean;
    private LSESSION = 0;

    constructor(
        private http2: HttpClient,
        private gs: GlobalService
    ) { }
    
    public ClearInit() {
        this.record = <OthGeneralModel>{
            errormessage: '',
            records: [],
            searchQuery: <SearchQuery>{ searchString: 'ALL', handled_id: this.gs.user_handled_id, handled_name: this.gs.user_handled_name , show_hide: false },
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
        this.param_type = params.menu_param;

        this.record = <OthGeneralModel>{
            errormessage: '',
            records: [],
            searchQuery: <SearchQuery>{ searchString: 'ALL', handled_id: this.gs.user_handled_id, handled_name: this.gs.user_handled_name , show_hide: false },
            pageQuery: <PageQuery>{ action: 'NEW', page_count: 0, page_current: -1, page_rowcount: 0, page_rows: 0 }
        };

        this.mdata$.next(this.record);

        this.isCompany = this.gs.IsCompany(this.menuid);
        this.isAdmin = this.gs.IsAdmin(this.menuid);
        this.title = this.gs.getTitle(this.menuid);

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
        SearchData.page_rowcount = this.gs.ROWS_TO_DISPLAY;

        SearchData.CURRENT_DATE = this.gs.defaultValues.today;
        SearchData.SHIPMENT_TYPE = this.record.searchQuery.searchString;
        SearchData.IS_HIDDEN = this.record.searchQuery.show_hide == true ? 'Y' : 'N';
        SearchData.HANDLED_ID = this.record.searchQuery.handled_id;

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
            this.record.errormessage = '';
            this.record.pageQuery = <PageQuery>{ action: 'NEW', page_rows: response.page_rows, page_count: response.page_count, page_current: response.page_current, page_rowcount: response.page_rowcount };
            this.record.records = response.list;
            this.mdata$.next(this.record);
        }, error => {
            this.record = <OthGeneralModel>{
                records: [],
                errormessage: this.gs.getError(error),
            }
            this.mdata$.next(this.record);
        });
    }

    HideRecord(_rec:Tbl_cargo_general)
    {
        var SearchData = this.gs.UserInfo;
        SearchData.STYPE = _rec.mbl_pending_status;
        SearchData.MBLID = _rec.mbl_pkid;
        this.HideARRecord(SearchData).subscribe(response => {
            if (response.retvalue == false) {
                this.record.errormessage = response.error;
                alert(this.record.errormessage);
                this.mdata$.next(this.record);
            } else {
                this.record.records.filter(x => x.mbl_pkid === _rec.mbl_pkid).forEach(x => this.record.records.splice(this.record.records.indexOf(x), 1));
            }
            
        }, error => {
            this.record = <OthGeneralModel>{
                records: [],
                errormessage: this.gs.getError(error),
            }
            this.mdata$.next(this.record);
        });
    }
    

    List(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Other/AlertLogPage/List', SearchData, this.gs.headerparam2('authorized'));
    }
    FollowupList(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Other/AlertLogPage/FollowupList', SearchData, this.gs.headerparam2('authorized'));
    }

    DeleteRecord(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Other/AlertLogPage/DeleteRecord', SearchData, this.gs.headerparam2('authorized'));
    }

    HideARRecord(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Other/AlertLogPage/HideARRecord', SearchData, this.gs.headerparam2('authorized'));
    }
}
