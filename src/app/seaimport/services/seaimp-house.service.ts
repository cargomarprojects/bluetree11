
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, BehaviorSubject } from 'rxjs';

import { GlobalService } from '../../core/services/global.service';
import { Tbl_cargo_imp_housem, SeaImpHouseModel, vm_tbl_cargo_imp_housem } from '../models/tbl_cargo_imp_housem';
import { SearchQuery } from '../models/tbl_cargo_imp_housem';
import { PageQuery } from '../../shared/models/pageQuery';

@Injectable({
    providedIn: 'root'
})
export class SeaImpHouseService {

    private mdata$ = new BehaviorSubject<SeaImpHouseModel>(null);
    get data$(): Observable<SeaImpHouseModel> {
        return this.mdata$.asObservable();
    }
    private record: SeaImpHouseModel;

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
    private LSESSION = 0;

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
        this.record = <SeaImpHouseModel>{
            sortcol : 'mbl_refno',
            sortorder : true,
            errormessage: '',
            records: [],
            searchQuery: <SearchQuery>{ searchString: '', fromdate: this.gs.getPreviousDate(this.gs.SEARCH_DATE_DIFF), todate: this.gs.defaultValues.today, mblid: '' },
            pageQuery: <PageQuery>{ action: 'NEW', page_count: 0, page_current: -1, page_rowcount: 0, page_rows: 0 }
        };

        this.mdata$.next(this.record);
    }

    public init(params: any) {
   
        if (this.LSESSION < this.gs.GSESSION)
        {
            this.LSESSION = this.gs.GSESSION;
            this.initlialized = false;
        }
        
        if (this.initlialized)
            return;

        this.id = params.id;
        this.menuid = params.id;
        this.param_type = params.param_type;
        this.record = <SeaImpHouseModel>{
            sortcol : 'mbl_refno',
            sortorder : true,
            errormessage: '',
            records: [],
            searchQuery: <SearchQuery>{ searchString: '', fromdate: this.gs.getPreviousDate(this.gs.SEARCH_DATE_DIFF), todate: this.gs.defaultValues.today, mblid: '' },
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
        SearchData.OVERRIDE_POD_ETA = this.gs.SEA_IMP_OVERRIDE_POD_ETA;
        SearchData.BRANCH_REGION = this.gs.BRANCH_REGION;
        SearchData.PARENT_ID = '';
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
            this.record = <SeaImpHouseModel>{
                records: [],
                errormessage: this.gs.getError(error),
            };
            this.mdata$.next(this.record);
        });
    }

    DeleteRow(_rec: Tbl_cargo_imp_housem) {

        if (this.gs.isBlank(_rec.hbl_pkid) || this.gs.isBlank(_rec.hbl_mbl_id)) {
            this.record.errormessage = "Cannot Delete, Reference Not Found";
            alert(this.record.errormessage);
            this.mdata$.next(this.record);
            return;
        }

        if (!confirm("DELETE " + _rec.hbl_houseno)) {
            return;
        }

        this.record.errormessage = '';
        var SearchData = this.gs.UserInfo;
        SearchData.pkid = _rec.hbl_pkid;
        SearchData.mblid = _rec.hbl_mbl_id;
        SearchData.remarks = _rec.hbl_houseno;

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
                alert(this.record.errormessage);
                this.mdata$.next(this.record);
            });
    }

    List(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/SeaImport/House/List', SearchData, this.gs.headerparam2('authorized'));
    }

    GetRecord(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/SeaImport/House/GetRecord', SearchData, this.gs.headerparam2('authorized'));
    }

    Isblnoduplication(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/SeaImport/House/Isblnoduplication', SearchData, this.gs.headerparam2('authorized'));
    }

    Save(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/SeaImport/House/Save', SearchData, this.gs.headerparam2('authorized'));
    }

    LoadMasterData(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/SeaImport/House/LoadMasterData', SearchData, this.gs.headerparam2('authorized'));
    }

    LoadCha(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/SeaImport/House/LoadCha', SearchData, this.gs.headerparam2('authorized'));
    }

    DeleteRecord(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/SeaImport/House/DeleteRecord', SearchData, this.gs.headerparam2('authorized'));
    }
    UpdatePuEr(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/SeaImport/House/UpdatePuEr', SearchData, this.gs.headerparam2('authorized'));
    }
    // GetArrivalNotice(SearchData: any) {
    //     return this.http2.post<any>(this.gs.baseUrl + '/api/SeaImport/House/GetArrivalNotice', SearchData, this.gs.headerparam2('authorized'));
    // }

    // GetPreAlertReport(SearchData: any) {
    //     return this.http2.post<any>(this.gs.baseUrl + '/api/SeaImport/House/GetPreAlertReport', SearchData, this.gs.headerparam2('authorized'));
    // }
    // GetTurnOverReport(SearchData: any) {
    //     return this.http2.post<any>(this.gs.baseUrl + '/api/SeaImport/House/GetTurnOverReport', SearchData, this.gs.headerparam2('authorized'));
    // }
}
