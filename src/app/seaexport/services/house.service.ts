
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from '../../core/services/global.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { SearchQuery, SeaExpHouseModel } from '../models/tbl_cargo_exp_housem';
import { PageQuery } from '../../shared/models/pageQuery';
import { Tbl_cargo_exp_housem } from 'src/app/airexport/models/tbl_cargo_exp_masterm';

@Injectable({
    providedIn: 'root'
})
export class HouseService {

    private mdata$ = new BehaviorSubject<SeaExpHouseModel>(null);
    get data$(): Observable<SeaExpHouseModel> {
        return this.mdata$.asObservable();
    }
    private record: SeaExpHouseModel;

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
    public ClearInit()
    {
        this.record = <SeaExpHouseModel>{
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
        this.record = <SeaExpHouseModel>{
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
            this.record = <SeaExpHouseModel>{
                records: [],
                errormessage: this.gs.getError(error),
            };
            this.mdata$.next(this.record);
        });
    }

    DeleteRow(_rec: Tbl_cargo_exp_housem) {
        if (this.gs.isBlank(_rec.hbl_pkid) || this.gs.isBlank(_rec.hbl_mbl_id)) {
            this.record.errormessage = "Cannot Delete, Reference Not Found";
            alert(this.record.errormessage);
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
        return this.http2.post<any>(this.gs.baseUrl + '/api/SeaExport/HousePage/List', SearchData, this.gs.headerparam2('authorized'));
    }

    GetRecord(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/SeaExport/HousePage/GetRecord', SearchData, this.gs.headerparam2('authorized'));
    }

    GetHouseDefaultRecord(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/SeaExport/HousePage/GetHouseDefaultRecord', SearchData, this.gs.headerparam2('authorized'));
    }

    Save(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/SeaExport/HousePage/Save', SearchData, this.gs.headerparam2('authorized'));
    }

    GetContainer(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/SeaExport/Common/GetContainer', SearchData, this.gs.headerparam2('authorized'));
    }

    GetDesc(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/SeaExport/Common/GetDesc', SearchData, this.gs.headerparam2('authorized'));
    }

    GetMblWeight(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/SeaExport/Common/GetMblWeight', SearchData, this.gs.headerparam2('authorized'));
    }

    DeleteRecord(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/SeaExport/HousePage/DeleteRecord', SearchData, this.gs.headerparam2('authorized'));
    }

}