import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { GlobalService } from '../../core/services/global.service';
import { Tbl_Cargo_Wiretransferm,Tbl_Cargo_Wiretransferd, WireTransfermModel, vm_Tbl_Cargo_Wiretransferm } from '../models/tbl_cargo_wiretransferm';
import { SearchQuery } from '../models/tbl_cargo_wiretransferm';
import { PageQuery } from '../../shared/models/pageQuery';

@Injectable({
    providedIn: 'root'
})
export class WireTransferedService {

    private mdata$ = new BehaviorSubject<WireTransfermModel>(null);
    get data$(): Observable<WireTransfermModel> {
        return this.mdata$.asObservable();
    }
    private record: WireTransfermModel;

    public id: string;
    public menuid: string;
    public param_type: string;

    public title: string;
    public isAdmin: boolean;
    public canAdd: boolean;
    public canEdit: boolean;
    public canSave: boolean;
    public canDelete: boolean;
    public canPrint: boolean;

    public initlialized: boolean;
    private appid =''
    
    constructor(
        private http2: HttpClient,
        private gs: GlobalService
    ) { }
    
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
        this.record = <WireTransfermModel>{
            sortcol : 'cwm_refno',
            sortorder : true,
            errormessage: '',
            records: [],
            searchQuery: <SearchQuery>{ searchString: '', fromdate:  this.gs.getPreviousDate(this.gs.SEARCH_DATE_DIFF), todate: this.gs.defaultValues.today},
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
        this.param_type = params.menu_param;
        this.record = <WireTransfermModel>{
            sortcol : 'cwm_refno',
            sortorder : true,
            errormessage: '',
            records: [],
            searchQuery: <SearchQuery>{ searchString: '', fromdate:  this.gs.getPreviousDate(this.gs.SEARCH_DATE_DIFF), todate: this.gs.defaultValues.today },
            pageQuery: <PageQuery>{ action: 'NEW', page_count: 0, page_current: -1, page_rowcount: 0, page_rows: 0 }
        };

        this.mdata$.next(this.record);

        this.isAdmin = this.gs.IsAdmin(this.menuid);
        this.title = this.gs.getTitle(this.menuid);
        this.canAdd = this.gs.canAdd(this.menuid);
        this.canEdit = this.gs.canEdit(this.menuid);
        this.canDelete = this.gs.canDelete(this.menuid);
        this.canPrint = this.gs.canPrint(this.menuid);
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



    RefreshList(_rec: Tbl_Cargo_Wiretransferm) {
        if (this.gs.isBlank(this.record))
            return;
        if (this.gs.isBlank(this.record.records))
            return;
        var REC = this.record.records.find(rec => rec.cwm_pkid == _rec.cwm_pkid);
        if (REC == null) {
            this.record.records.push(_rec);
        }
        else {

            REC.cwm_refno = _rec.cwm_refno;
            REC.cwm_date = _rec.cwm_date;
            REC.cwm_to_name = _rec.cwm_to_name;
            REC.cwm_company_name = _rec.cwm_company_name;;
            REC.cwm_company_tel = _rec.cwm_company_tel;
            REC.cwm_company_fax = _rec.cwm_company_fax;
            REC.cwm_request_type = _rec.cwm_request_type;
        }
    }

    DeleteRow(_rec: Tbl_Cargo_Wiretransferm) {

        if (!confirm("DELETE " + _rec.cwm_refno)) {
            return;
        }

        this.record.errormessage = '';
        var SearchData = this.gs.UserInfo;
        SearchData.pkid = _rec.cwm_pkid;
        SearchData.remarks = _rec.cwm_refno + ", " + _rec.cwm_to_name.toString() + ", " + _rec.cwm_company_name.toString();

        this.DeleteRecord(SearchData)
            .subscribe(response => {
                if (response.retvalue == false) {
                    this.record.errormessage = response.error;
                    alert(this.record.errormessage);
                }
                else {
                    this.record.records.splice(this.record.records.findIndex(rec => rec.cwm_pkid == _rec.cwm_pkid), 1);
                }
                this.mdata$.next(this.record);
            }, error => {
                this.record.errormessage = this.gs.getError(error);
                alert(this.record.errormessage);
                this.mdata$.next(this.record);
            });
    }

     
    List(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Other/WireTransfered/List', SearchData, this.gs.headerparam2('authorized'));
    }

    GetRecord(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Other/WireTransfered/GetRecord', SearchData, this.gs.headerparam2('authorized'));
    }

    Save(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Other/WireTransfered/Save', SearchData, this.gs.headerparam2('authorized'));
    }

    DeleteRecord(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Other/WireTransfered/DeleteRecord', SearchData, this.gs.headerparam2('authorized'));
    }

    LoadGenList(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Other/WireTransfered/LoadGenList', SearchData, this.gs.headerparam2('authorized'));
    }

}
