import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, BehaviorSubject } from 'rxjs';

import { GlobalService } from '../../core/services/global.service';
import { vm_Tbl_Email_jobs, Tbl_Email_jobs, Tbl_Email_jobs_Model } from '../models/Tbl_Email_jobs';
import { SearchQuery } from '../models/Tbl_User_Active';
import { PageQuery } from '../../shared/models/pageQuery';


@Injectable({
    providedIn: 'root'
})
export class EmailReportService {

    private mdata$ = new BehaviorSubject<Tbl_Email_jobs_Model>(null);
    get data$(): Observable<Tbl_Email_jobs_Model> {
        return this.mdata$.asObservable();
    }
    private record: Tbl_Email_jobs_Model;

    public id: string;
    public menuid: string;
    public param_type: string;

    public title: string;
    public isAdmin: boolean;
    public canAdd: boolean;
    public canEdit: boolean;
    public canSave: boolean;

    public initlialized: boolean;
    private appid = '';
    private oldrecords: Tbl_Email_jobs[] = [];
    public datetype = 'NA';

    constructor(
        private http2: HttpClient,
        private gs: GlobalService
    ) { }

    public selectRowId(id: string) {
        this.record.selectedId = id;
    }
    public getRowId() {
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
        this.record = <Tbl_Email_jobs_Model>{
            selectedId: '',
            sortcol: '',
            sortorder: true,
            errormessage: '',
            records: [],
            searchQuery: <SearchQuery>{ searchString: 'WAITING' },
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

        this.record = <Tbl_Email_jobs_Model>{
            selectedId: '',
            sortcol: '',
            sortorder: true,
            errormessage: '',
            records: [],
            searchQuery: <SearchQuery>{ searchString: 'WAITING' },
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
            this.record.selectedId = '';
        }
        if (type == 'PAGE') {
            this.record.pageQuery = _searchdata.pageQuery;
        }

        var SearchData = this.gs.UserInfo;
        SearchData.outputformat = 'SCREEN';
        SearchData.action = 'NEW';
        SearchData.pkid = this.id;
        SearchData.page_rowcount = this.gs.ROWS_TO_DISPLAY;
        SearchData.page_count = 0;
        SearchData.page_rows = 30;
        SearchData.page_current = -1;
        SearchData.MAIL_STATUS = this.record.searchQuery.searchString;
        SearchData.REPORT_FOLDER = this.gs.GLOBAL_REPORT_FOLDER;

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

            // this.oldrecords = <Tbl_User_Active[]>[];
            // this.record.records.forEach(rec => this.oldrecords.push(Object.assign({}, rec)));

        }, error => {
            this.record.errormessage = this.gs.getError(error);
            this.mdata$.next(this.record);
            alert(this.record.errormessage);
        });
    }

    ScheduleMail(_id: string) {

        if (!confirm("Process mail Y/N")) {
            return;
        }

        let SearchData = {
            table: 'schedule_mail',
            pkid: _id,
            company_code: this.gs.company_code,
            branch_code: this.gs.branch_code
        };
        this.gs.SearchRecord(SearchData)
            .subscribe(response => {
                alert('Processed Successfully');

                if (this.gs.isBlank(_id)) {
                    let _searchdata = {
                        searchQuery: <SearchQuery>{ searchString: 'WAITING' },
                    };
                    this.Search(_searchdata, 'SEARCH');
                } else {
                    var REC = this.record.records.find(rec => rec.pkid == _id);
                    if (REC != null) {
                        REC.mail_status = response.status;
                        REC.send_date = response.senddate;
                        REC.error_msg = response.errmsg;
                    }
                }
            },
                error => {
                    // this.record.errormessage = this.gs.getError(error);
                    // this.mdata$.next(this.record);
                    alert(this.gs.getError(error));
                });
    }


    List(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Report/EmailReport', SearchData, this.gs.headerparam2('authorized'));
    }


}
