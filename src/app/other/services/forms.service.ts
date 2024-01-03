import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { GlobalService } from '../../core/services/global.service';
import { Tbl_cargo_genfiles, Tbl_cargo_genfilesModel } from '../models/Tbl_cargo_genfiles';
import { SearchQuery } from '../models/Tbl_cargo_genfiles';
import { PageQuery } from '../../shared/models/pageQuery';

@Injectable({
    providedIn: 'root'
})
export class FormsService {

    private mdata$ = new BehaviorSubject<Tbl_cargo_genfilesModel>(null);
    get data$(): Observable<Tbl_cargo_genfilesModel> {
        return this.mdata$.asObservable();
    }
    private record: Tbl_cargo_genfilesModel;

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
    private appid = ''
    private db: Tbl_cargo_genfilesModel[] = [];

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
        this.record = <Tbl_cargo_genfilesModel>{
            selectedId: '',
            sortcol: 'gf_refno',
            sortorder: true,
            errormessage: '',
            records: [],
            searchQuery: <SearchQuery>{ searchString: '', sdate: '', edate: '', accNo: '' },
            pageQuery: <PageQuery>{ action: 'NEW', page_count: 0, page_current: -1, page_rowcount: 0, page_rows: 0 }
        };
        this.mdata$.next(this.record);
    }
    public init(params: any) {
        if (this.appid != this.gs.appid) {
            this.appid = this.gs.appid;
            this.initlialized = false;
            this.db = <Tbl_cargo_genfilesModel[]>[];
        }


        this.id = params.id;
        this.menuid = params.id;
        this.param_type = params.menu_param;

        if (!this.gs.isBlank(this.db[this.param_type]))
            this.record = <Tbl_cargo_genfilesModel>this.db[this.param_type];
        else
            this.record = <Tbl_cargo_genfilesModel>{
                selectedId: '',
                sortcol: 'gf_refno',
                sortorder: true,
                errormessage: '',
                records: [],
                searchQuery: <SearchQuery>{ searchString: '', sdate: '', edate: '', accNo: '' },
                pageQuery: <PageQuery>{ action: 'NEW', page_count: 0, page_current: -1, page_rowcount: 0, page_rows: 0 }
            };

        this.mdata$.next(this.record);

        this.isAdmin = this.gs.IsAdmin(this.menuid);
        this.title = this.gs.getTitle(this.menuid);
        this.canAdd = this.gs.canAdd(this.menuid);
        this.canEdit = this.gs.canEdit(this.menuid);
        this.canDelete = this.gs.canDelete(this.menuid);
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
        SearchData.CODE = '';
        if (this.param_type == "ADMIN")
            SearchData.GFCATEGORY = 'ADMINFORMS';
        else
            SearchData.GFCATEGORY = this.param_type;
        if (this.gs.user_isadmin == "Y" || this.isAdmin || this.param_type == "ADMIN")
            SearchData.ISADMIN = 'Y';
        else
            SearchData.ISADMIN = 'N';
        SearchData.SDATE = this.record.searchQuery.sdate;
        SearchData.EDATE = this.record.searchQuery.edate;

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
            this.db[this.param_type] = this.record;
        }, error => {
            this.record.errormessage = this.gs.getError(error);
            this.mdata$.next(this.record);
            alert(this.record.errormessage);
        });
    }

    RefreshList(_rec: Tbl_cargo_genfiles) {
        if (this.record.records == null)
            return;
        var REC = this.record.records.find(rec => rec.gf_pkid == _rec.gf_pkid);
        if (REC == null) {
            this.record.records.push(_rec);
        }
        else {
            REC.gf_pkid = _rec.gf_pkid;
            REC.gf_type = _rec.gf_type;
            REC.gf_name = _rec.gf_name;
            REC.gf_remarks = _rec.gf_remarks;
            REC.gf_file_name = _rec.gf_file_name;
            // REC.rec_created_by = _rec.rec_created_by;
            // REC.rec_created_date = _rec.rec_created_date;
        }
    }

    DeleteRow(_rec: Tbl_cargo_genfiles) {

        this.record.errormessage = '';
        if (_rec.gf_slno.toString().trim() == "") {
            this.record.errormessage = "Invalid Data, Delete";
            this.mdata$.next(this.record);
            return;
        }

        if (!confirm("DELETE " + _rec.gf_refno)) {
            return;
        }

        let filepath = "..\\Files_Folder\\" + this.gs.FILES_FOLDER + "\\Files\\";
        var SearchData = this.gs.UserInfo;
        SearchData.pkid = _rec.gf_pkid;
        SearchData.remarks = "SLNO " + _rec.gf_slno;
        SearchData.filepath = filepath;

        this.DeleteRecord(SearchData)
            .subscribe(response => {
                if (response.retvalue == false) {
                    this.record.errormessage = response.error;
                    alert(this.record.errormessage);
                }
                else {
                    this.record.records.splice(this.record.records.findIndex(rec => rec.gf_pkid == _rec.gf_pkid), 1);
                }
            }, error => {
                this.record.errormessage = this.gs.getError(error);
                alert(this.record.errormessage);
            });
    }


    List(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Forms/List', SearchData, this.gs.headerparam2('authorized'));
    }

    GetRecord(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Forms/GetRecord', SearchData, this.gs.headerparam2('authorized'));
    }


    DeleteRecord(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Forms/Delete', SearchData, this.gs.headerparam2('authorized'));
    }

    Save(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Forms/Save', SearchData, this.gs.headerparam2('authorized'));
    }




}
