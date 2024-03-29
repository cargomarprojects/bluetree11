import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { GlobalService } from '../../core/services/global.service';
import { Tbl_cargo_slip, MessengerSlipModel, vm_tbl_cargo_slip } from '../models/tbl_cargo_slip';
import { SearchQuery } from '../models/tbl_cargo_slip';
import { PageQuery } from '../../shared/models/pageQuery';

@Injectable({
    providedIn: 'root'
})
export class MessengerSlipService {

    private mdata$ = new BehaviorSubject<MessengerSlipModel>(null);
    get data$(): Observable<MessengerSlipModel> {
        return this.mdata$.asObservable();
    }
    private record: MessengerSlipModel;

    public id: string;
    public menuid: string;
    public param_type: string;

    public title: string;
    public isAdmin: boolean;
    public canAdd: boolean;
    public canEdit: boolean;
    public canSave: boolean;

    public initlialized: boolean;
    private appid =''
    
    constructor(
        private http2: HttpClient,
        private gs: GlobalService
    ) { }
    public selectRowId( id : string){
        this.record.selectedId = id;
    }
    public getRowId(){
        return this.record.selectedId;
    }
    
    public getSortCol(){
        return this.record.sortcol;
    }
    public getSortOrder(){
        return this.record.sortorder;
    }

    public getIcon(col : string){
        if ( col == this.record.sortcol){
          if ( this.record.sortorder )
            return 'fa fa-arrow-down';
          else 
            return 'fa fa-arrow-up';
        }
        else 
          return null;
    }
    
    public  sort(col : string){
        if ( col == this.record.sortcol){
          this.record.sortorder = !this.record.sortorder;
        }
        else 
        {
          this.record.sortcol = col;
          this.record.sortorder = true;
        }
    }
    public ClearInit() {
        this.record = <MessengerSlipModel>{
            selectedId : '',
            sortcol : 'cs_refno',
            sortorder : true,
            errormessage: '',
            records: [],
            searchQuery: <SearchQuery>{ searchString: '', fromdate:  this.gs.getPreviousDate(this.gs.SEARCH_DATE_DIFF), todate: this.gs.defaultValues.today, mblid: '' },
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
        this.record = <MessengerSlipModel>{
            selectedId : '',
            sortcol : 'cs_refno',
            sortorder : true,
            errormessage: '',
            records: [],
            searchQuery: <SearchQuery>{ searchString: '', fromdate:  this.gs.getPreviousDate(this.gs.SEARCH_DATE_DIFF), todate: this.gs.defaultValues.today, mblid: '' },
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

    Search(_searchdata: any, type: string = '') {

        if (type == 'SEARCH') {
            this.record.searchQuery = _searchdata.searchQuery;
            this.record.selectedId = '';
        }
        if (type == 'PAGE') {
            this.record.pageQuery = _searchdata.pageQuery;
        }

        var SearchData = this.gs.UserInfo;
        SearchData.outputformat = 'SCREEN';
        SearchData.action = 'NEW';
        SearchData.MBLID = '';
        SearchData.OPERATION_MODE = 'GENERAL';
        SearchData.page_rowcount = this.gs.ROWS_TO_DISPLAY;
        SearchData.CODE = this.record.searchQuery.searchString;
        SearchData.SDATE = this.record.searchQuery.fromdate;
        SearchData.EDATE = this.record.searchQuery.todate;
        SearchData.page_count = 0;
        SearchData.page_rows = 0;
        SearchData.page_current = -1;

        if (type == 'PAGE') {
            SearchData.action = this.record.pageQuery.action;
            SearchData.page_count = this.record.pageQuery.page_count;
            SearchData.page_rows = this.record.pageQuery.page_rows;
            SearchData.page_current = this.record.pageQuery.page_current;
        }

        this.List(SearchData).subscribe(response => {
            this.record.pageQuery = <PageQuery>{ action: 'NEW', page_rows: response.page_rows, page_count: response.page_count, page_current: response.page_current, page_rowcount: response.page_rowcount };
            this.record.records = response.list;
            this.mdata$.next(this.record);
        }, error => {
            this.record.errormessage = this.gs.getError(error);
            this.mdata$.next(this.record);
            alert(this.record.errormessage);
        });
    }

    RefreshList(_rec: Tbl_cargo_slip) {
        if (this.record.records == null)
            return;
        var REC = this.record.records.find(rec => rec.cs_pkid == _rec.cs_pkid);
        if (REC == null) {
            this.record.records.push(_rec);
        }
        else {
            REC.cs_refno = _rec.cs_refno;
            REC.cs_date = _rec.cs_date;
            REC.cs_to_name = _rec.cs_to_name;
            REC.cs_to_tel = _rec.cs_to_tel;
            REC.cs_to_fax = _rec.cs_to_fax;
            // REC.rec_created_by = _rec.rec_created_by;
            // REC.rec_created_date = _rec.rec_created_date;
        }
    }

    GeneralList(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Other/MessengerSlip/GeneralList', SearchData, this.gs.headerparam2('authorized'));
    }
    List(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Other/MessengerSlip/List', SearchData, this.gs.headerparam2('authorized'));
    }

    GetRecord(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Other/MessengerSlip/GetRecord', SearchData, this.gs.headerparam2('authorized'));
    }

    Save(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Other/MessengerSlip/Save', SearchData, this.gs.headerparam2('authorized'));
    }

    LoadDeliveryAddress(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Other/MessengerSlip/LoadDeliveryAddress', SearchData, this.gs.headerparam2('authorized'));
    }

}
