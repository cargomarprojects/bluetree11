
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, BehaviorSubject } from 'rxjs';

import { GlobalService } from '../../core/services/global.service';
import { Tbl_cargo_general, OthGeneralModel, vm_tbl_cargo_general } from '../models/tbl_cargo_general';
import { SearchQuery } from '../models/tbl_cargo_general';
import { PageQuery } from '../../shared/models/pageQuery';

@Injectable({
    providedIn: 'root'
})
export class OthGeneralExpenseService {

    private mdata$ = new BehaviorSubject<OthGeneralModel>(null);
    get data$(): Observable<OthGeneralModel> {
        return this.mdata$.asObservable();
    }
    private record: OthGeneralModel;

    public id: string;
    public menuid: string;
    public param_type: string;

    public title: string;
    public isAdmin: boolean;
    public canAdd: boolean;
    public canEdit: boolean;
    public canSave: boolean;

    public initlialized: boolean;
    private menutype: string = '';
    private LSESSION = 0;

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
        this.menutype = '';
        this.gs.GENERALEXPENSE_INIT_GE = null;
        this.gs.GENERALEXPENSE_INIT_PR = null;
        this.gs.GENERALEXPENSE_INIT_CM = null;
        this.gs.GENERALEXPENSE_INIT_PS = null;
        this.gs.GENERALEXPENSE_INIT_FA = null;
        this.record = <OthGeneralModel>{
            sortcol: 'mbl_refno',
            sortorder: true,
            errormessage: '',
            records: [],
            searchQuery: <SearchQuery>{ searchString: '', fromdate: this.gs.getPreviousDate(this.gs.SEARCH_DATE_DIFF), todate: this.gs.defaultValues.today },
            pageQuery: <PageQuery>{ action: 'NEW', page_count: 0, page_current: -1, page_rowcount: 0, page_rows: 0 }
        };
        this.mdata$.next(this.record);
    }
    public init(params: any) {
        if (this.LSESSION < this.gs.GSESSION) {
            this.LSESSION = this.gs.GSESSION;
            this.initlialized = false;
            this.menutype = '';
            this.gs.GENERALEXPENSE_INIT_GE = null;
            this.gs.GENERALEXPENSE_INIT_PR = null;
            this.gs.GENERALEXPENSE_INIT_CM = null;
            this.gs.GENERALEXPENSE_INIT_PS = null;
            this.gs.GENERALEXPENSE_INIT_FA = null;
        }

        this.id = params.id;
        this.menuid = params.menuid;
        this.param_type = params.menu_param;

        if (this.menutype != this.param_type) {
            this.menutype = this.param_type;

            if (this.menutype == 'GE' && !this.gs.isBlank(this.gs.GENERALEXPENSE_INIT_GE))
                this.record = this.gs.GENERALEXPENSE_INIT_GE;
            else if (this.menutype == 'PR' && !this.gs.isBlank(this.gs.GENERALEXPENSE_INIT_PR))
                this.record = this.gs.GENERALEXPENSE_INIT_PR;
            else if (this.menutype == 'CM' && !this.gs.isBlank(this.gs.GENERALEXPENSE_INIT_CM))
                this.record = this.gs.GENERALEXPENSE_INIT_CM;
            else if (this.menutype == 'PS' && !this.gs.isBlank(this.gs.GENERALEXPENSE_INIT_PS))
                this.record = this.gs.GENERALEXPENSE_INIT_PS;
            else if (this.menutype == 'FA' && !this.gs.isBlank(this.gs.GENERALEXPENSE_INIT_FA))
                this.record = this.gs.GENERALEXPENSE_INIT_FA;
            else
                this.record = <OthGeneralModel>{
                    sortcol: 'mbl_refno',
                    sortorder: true,
                    errormessage: '',
                    records: [],
                    searchQuery: <SearchQuery>{ searchString: '', fromdate: this.gs.getPreviousDate(this.gs.SEARCH_DATE_DIFF), todate: this.gs.defaultValues.today },
                    pageQuery: <PageQuery>{ action: 'NEW', page_count: 0, page_current: -1, page_rowcount: 0, page_rows: 0 }
                };

            this.mdata$.next(this.record);

            if (this.menutype == 'GE')
                this.gs.GENERALEXPENSE_INIT_GE = this.record;
            else if (this.menutype == 'PR')
                this.gs.GENERALEXPENSE_INIT_PR = this.record;
            else if (this.menutype == 'CM')
                this.gs.GENERALEXPENSE_INIT_CM = this.record;
            else if (this.menutype == 'PS')
                this.gs.GENERALEXPENSE_INIT_PS = this.record;
            else if (this.menutype == 'FA')
                this.gs.GENERALEXPENSE_INIT_FA = this.record;
        }

        this.isAdmin = this.gs.IsAdmin(this.menuid);
        this.title = this.gs.getTitle(this.menuid);
        this.canAdd = this.gs.canAdd(this.menuid);
        this.canEdit = this.gs.canEdit(this.menuid);
        this.canSave = this.canAdd || this.canEdit;

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
        SearchData.EXPTYPE = this.param_type;
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
            SearchData.page_current = this.record.pageQuery.page_current;;
        }

        this.List(SearchData).subscribe(response => {
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

    List(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Other/GeneralExpense/List', SearchData, this.gs.headerparam2('authorized'));
    }

    GetRecord(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Other/GeneralExpense/GetRecord', SearchData, this.gs.headerparam2('authorized'));
    }

    Save(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Other/GeneralExpense/Save', SearchData, this.gs.headerparam2('authorized'));
    }

    Isblnoduplication(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Other/GeneralExpense/Isblnoduplication', SearchData, this.gs.headerparam2('authorized'));
    }


    GetFALockDetails(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Other/GeneralExpense/GetFALockDetails', SearchData, this.gs.headerparam2('authorized'));
    }

    GetHouseDetails(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Other/GeneralExpense/GetHouseDetails', SearchData, this.gs.headerparam2('authorized'));
    }

}
