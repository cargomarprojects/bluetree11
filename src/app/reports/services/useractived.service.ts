
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, BehaviorSubject } from 'rxjs';
import { GlobalService } from '../../core/services/global.service';
import { Tbl_User_Actived, UserActiveDetModel } from '../models/Tbl_User_Actived';
import { SearchQuery } from '../models/Tbl_User_Actived';
import { PageQuery } from '../../shared/models/pageQuery';

@Injectable({
    providedIn: 'root'
})
export class UserActiveDetService {

    private mdata$ = new BehaviorSubject<UserActiveDetModel>(null);
    get data$(): Observable<UserActiveDetModel> {
        return this.mdata$.asObservable();
    }
    private record: UserActiveDetModel;

    public id: string;
    public menuid: string;
    public param_type: string;
    public userid: string;
    public datetype: string;

    public title: string;
    public isAdmin: boolean;
    public canAdd: boolean;
    public canEdit: boolean;
    public canSave: boolean;
    public canDelete: boolean;

    public initlialized: boolean;
    private appid = '';
    public userList: any[];

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
        this.record = <UserActiveDetModel>{
            selectedId: '',
            sortcol: '',
            sortorder: true,
            errormessage: '',
            records: [],
            searchQuery: <SearchQuery>{ searchString: '', searchDatetype: this.datetype, fromdate: this.gs.defaultValues.today, todate: this.gs.defaultValues.today, userId: this.userid, allusers: false },
            pageQuery: <PageQuery>{ action: 'NEW', page_count: 0, page_current: -1, page_rowcount: 0, page_rows: 0 }
        };
        this.mdata$.next(this.record);
    }
    public init(params: any) {
        if (this.appid != this.gs.appid) {
            this.appid = this.gs.appid;
            this.initlialized = false;
        }

        if (this.userid != params.userid || this.datetype != params.datetype) {
            this.initlialized = false;
        }

        // if (this.initlialized)
        //     return;

        this.id = params.id;
        this.menuid = params.id;
        this.userid = params.userid;
        this.datetype = params.datetype;

        this.record = <UserActiveDetModel>{
            selectedId: '',
            sortcol: '',
            sortorder: true,
            errormessage: '',
            records: [],
            searchQuery: <SearchQuery>{ searchString: '', searchDatetype: this.datetype, fromdate: this.gs.defaultValues.today, todate: this.gs.defaultValues.today, userId: this.userid, allusers: false },
            pageQuery: <PageQuery>{ action: 'NEW', page_count: 0, page_current: -1, page_rowcount: 0, page_rows: 0 }
        };

        this.mdata$.next(this.record);

        this.isAdmin = this.gs.IsAdmin(this.menuid);
        this.title = this.gs.getTitle(this.menuid);
        this.canAdd = this.gs.canAdd(this.menuid);
        this.canEdit = this.gs.canEdit(this.menuid);
        this.canSave = this.canAdd || this.canEdit;
        this.canDelete = this.gs.canDelete(this.menuid);
        this.LoadUser();

        this.initlialized = true;

    }
    LoadUser() {
        var SearchData = this.gs.UserInfo;
        SearchData.CODE = "";
        SearchData.TYPE = "";
        SearchData.showall = "N";
        this.getUserList(SearchData).subscribe(response => {
            this.userList = <any>response.list;
        }, error => {
            this.record.errormessage = this.gs.getError(error);
            alert(this.record.errormessage);
        });
    }
    Search(_searchdata: any, type: string = '') {
        this.record.errormessage = '';
        if (_searchdata.outputformat == "EXCEL") {
            if (this.gs.isBlank(this.record.records)) {
                this.record.errormessage = 'List Not Found';
                alert(this.record.errormessage);
                return;
            }
        }
        if (_searchdata.outputformat == "SCREEN") {
            if (type == 'SEARCH') {
                this.record.searchQuery = _searchdata.searchQuery;
                this.record.selectedId = '';
            }
            if (type == 'PAGE') {
                this.record.pageQuery = _searchdata.pageQuery;
            }
        }

        var SearchData = this.gs.UserInfo;
        SearchData.outputformat = _searchdata.outputformat;
        SearchData.action = 'NEW';
        SearchData.pkid = this.id;
        SearchData.TYPE = this.param_type;
        SearchData.page_rowcount = this.gs.ROWS_TO_DISPLAY;
        SearchData.USER_ID = this.record.searchQuery.allusers ? "" : this.record.searchQuery.userId;
        SearchData.SDATE = this.record.searchQuery.fromdate;
        SearchData.EDATE = this.record.searchQuery.todate;
        SearchData.SEARCH_DATETYPE = this.record.searchQuery.searchDatetype;
        SearchData.page_count = 0;
        SearchData.page_rows = 0;
        SearchData.page_current = -1;

        if (_searchdata.outputformat == "SCREEN") {
            if (type == 'PAGE') {
                SearchData.action = this.record.pageQuery.action;
                SearchData.page_count = this.record.pageQuery.page_count;
                SearchData.page_rows = this.record.pageQuery.page_rows;
                SearchData.page_current = this.record.pageQuery.page_current;;
            }
        }

        this.List(SearchData).subscribe(response => {
            if (_searchdata.outputformat == "SCREEN") {
                this.record.pageQuery = <PageQuery>{ action: 'NEW', page_rows: response.page_rows, page_count: response.page_count, page_current: response.page_current, page_rowcount: response.page_rowcount };
                this.record.records = response.list;
                this.mdata$.next(this.record);
            } else {
                if (_searchdata.outputformat == "EXCEL")
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
        return this.http2.post<any>(this.gs.baseUrl + '/api/Report/UserActiveDetRpt', SearchData, this.gs.headerparam2('authorized'));
    }

    getUserList(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Auth/UserList', SearchData, this.gs.headerparam2('authorized'));
    }
}
