import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { GlobalService } from '../../core/services/global.service';
import { Download_Report_Model, Tbl_Download_Report } from '../models/tbl_download_report';
import { SearchQuery } from '../models/tbl_download_report';
import { PageQuery } from '../../shared/models/pageQuery';

@Injectable({
    providedIn: 'root'
})
export class DownloadReportService {

    private mdata$ = new BehaviorSubject<Download_Report_Model>(null);
    get data$(): Observable<Download_Report_Model> {
        return this.mdata$.asObservable();
    }
    private record: Download_Report_Model;

    public id: string;
    public menuid: string;
    public param_type: string;

    public title: string;
    public isAdmin: boolean;
    public canAdd: boolean;
    public canEdit: boolean;
    public canSave: boolean;
    public canPrint: boolean;

    public initlialized: boolean;
    private appid = '';

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
        this.record = <Download_Report_Model>{
            sortcol: 'mbl_refno',
            sortorder: true,
            errormessage: '',
            records: [],
            searchQuery: <SearchQuery>{
                searchString: '', searchGroup: 'SEA IMPORT', fromDate: this.gs.getPreviousDate(this.gs.SEARCH_DATE_DIFF), toDate: this.gs.defaultValues.today, agentId: '', agentName: '', carrierId: '', carrierName: '',
                shipmentCntr: '', shipmentType: ''
            },
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

        this.record = <Download_Report_Model>{
            sortcol: 'mbl_refno',
            sortorder: true,
            errormessage: '',
            records: [],
            searchQuery: <SearchQuery>{
                searchString: '', searchGroup: 'SEA IMPORT', fromDate: this.gs.getPreviousDate(this.gs.SEARCH_DATE_DIFF), toDate: this.gs.defaultValues.today, agentId: '', agentName: '', carrierId: '', carrierName: '',
                shipmentCntr: '', shipmentType: ''
            },
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
    }

    Search(_searchdata: any, type: string = '') {

        if (type == 'SEARCH') {
            this.record.searchQuery = _searchdata.searchQuery;
        }
        if (type == 'PAGE') {
            this.record.pageQuery = _searchdata.pageQuery;
        }


        var SearchData = this.gs.UserInfo;
        SearchData.outputformat = _searchdata.outputformat;
        SearchData.action = 'NEW';
        SearchData.pkid = this.id;
        SearchData.page_rowcount = this.gs.ROWS_TO_DISPLAY;
        SearchData.GROUP = this.record.searchQuery.searchGroup
        SearchData.CODE = this.record.searchQuery.searchString;
        SearchData.SDATE = this.record.searchQuery.fromDate;
        SearchData.EDATE = this.record.searchQuery.toDate;
        SearchData.AGENT_ID = this.record.searchQuery.agentId;
        SearchData.AGENT_NAME = this.record.searchQuery.agentName;    
        SearchData.CARRIER_ID = this.record.searchQuery.carrierId;
        SearchData.CARRIER_NAME = this.record.searchQuery.carrierName;
        SearchData.SHIPMENT_TYPE = this.record.searchQuery.shipmentType;
        SearchData.SHIPMENT_CNTR = this.record.searchQuery.shipmentCntr;
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
            else if (_searchdata.outputformat == "EXCEL") {
                this.Downloadfile(response.filename, response.filetype, response.filedisplayname);
            }
        }, error => {
            this.record.errormessage = this.gs.getError(error);
            this.mdata$.next(this.record);
            alert(this.record.errormessage);
        });
    }

    Downloadfile(filename: string, filetype: string, filedisplayname: string) {
        this.gs.DownloadFile(this.gs.GLOBAL_REPORT_FOLDER, filename, filetype, filedisplayname);
    }

    List(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Report/DownloadReport', SearchData, this.gs.headerparam2('authorized'));
    }


}