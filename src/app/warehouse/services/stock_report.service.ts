import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { GlobalService } from '../../core/services/global.service';
import { Stock_Report_Model, Tbl_Stock_Report } from '../models/Tbl_stock_report';
import { SearchQuery } from '../models/Tbl_stock_report';
import { PageQuery } from '../../shared/models/pageQuery';

@Injectable({
    providedIn: 'root'
})
export class StockReportService {

    private mdata$ = new BehaviorSubject<Stock_Report_Model>(null);
    get data$(): Observable<Stock_Report_Model> {
        return this.mdata$.asObservable();
    }
    private record: Stock_Report_Model;

    public id: string;
    public menuid: string;
    public param_type: string;

    public title: string;
    public isAdmin: boolean;
    public canAdd: boolean;
    public canEdit: boolean;
    public canSave: boolean;
    public canPrint: boolean;
    public zeroBal: boolean;

    public initlialized: boolean;
    private appid = '';
    public tab: string = 'main';
    public filename: string = '';
    public filetype: string = '';
    public filedisplayname: string = '';
    public filename2: string = '';
    public filetype2: string = '';
    public filedisplayname2: string = '';

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
        this.record = <Stock_Report_Model>{
            selectedId : '',
            sortcol: '',
            sortorder: true,
            errormessage: '',
            records: [],
            searchQuery: <SearchQuery>{ searchString: '', fromdate: '', todate: '', zerobal: false },
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

        this.record = <Stock_Report_Model>{
            selectedId : '',
            sortcol: '',
            sortorder: true,
            errormessage: '',
            records: [],
            searchQuery: <SearchQuery>{  searchString: '', fromdate: '', todate: '', zerobal: false  },
            pageQuery: <PageQuery>{ action: 'NEW', page_count: 0, page_current: -1, page_rowcount: 0, page_rows: 0 }
        };

        this.mdata$.next(this.record);
        this.isAdmin = this.gs.IsAdmin(this.menuid);
        this.title = this.gs.getTitle(this.menuid);
        this.canAdd = this.gs.canAdd(this.menuid);
        this.canEdit = this.gs.canEdit(this.menuid);
        this.canPrint = this.gs.canPrint(this.menuid);
        this.canSave = this.canAdd || this.canEdit;
        this.initlialized = true;
        this.zeroBal = false;
    }

    Search(_searchdata: any, type: string = '') {

        if (type == 'SEARCH') {
            this.record.searchQuery = _searchdata.searchQuery;
            this.record.selectedId = '';        
        }

        if (type == 'PAGE') {
            this.record.pageQuery = _searchdata.pageQuery;
        }

        this.zeroBal = this.record.searchQuery.zerobal;

        var SearchData = this.gs.UserInfo;
        SearchData.outputformat = _searchdata.outputformat;
        SearchData.action = 'NEW';
        SearchData.pkid = this.id;
        SearchData.page_rowcount = this.gs.ROWS_TO_DISPLAY;
        SearchData.SDATE = this.record.searchQuery.fromdate;
        SearchData.EDATE = this.record.searchQuery.todate;
        SearchData.SDATA = this.record.searchQuery.searchString;
        SearchData.COMP_CODE = this.gs.company_code;
        SearchData.IS_ZEROBAL = this.record.searchQuery.zerobal == true ? 'Y' : 'N';
        
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
            if (_searchdata.outputformat == "SCREEN") {
                this.record.pageQuery = <PageQuery>{ action: 'NEW', page_rows: response.page_rows, page_count: response.page_count, page_current: response.page_current, page_rowcount: response.page_rowcount };
                this.record.records = response.list;
                this.record.errormessage = '';
                this.mdata$.next(this.record);
            }
            else if (_searchdata.outputformat == "PRINT") {

                // this.filename = response.filename;
                // this.filetype = response.filetype;
                // this.filedisplayname = response.filedisplayname;
                // this.filename2 = response.filename2;
                // this.filetype2 = response.filetype2;
                // this.filedisplayname2 = response.filedisplayname2;
                // this.tab = 'report';
                // this.Downloadfile(response.filename, response.filetype, response.filedisplayname);
            }
        }, error => {
            this.record.errormessage = this.gs.getError(error);
            this.mdata$.next(this.record);
        });
    }

    GetCompName(_code: string) {
        let _sName = '';
        if (this.gs.CompanyList != null) {
            var REC = this.gs.CompanyList.find(rec => rec.comp_code == _code);
            if (REC != null) {
                _sName = REC.comp_name;
            }
        }
        return _sName;
    }
    Downloadfile(filename: string, filetype: string, filedisplayname: string) {
        this.gs.DownloadFile(this.gs.GLOBAL_REPORT_FOLDER, filename, filetype, filedisplayname);
    }

    List(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Warehouse/Report/StockReport', SearchData, this.gs.headerparam2('authorized'));
    }


}
