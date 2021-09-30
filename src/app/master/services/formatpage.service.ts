
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { GlobalService } from '../../core/services/global.service';
import { Tbl_cargo_hblformat, FormatModel, vm_Tbl_cargo_hblformat } from '../models/Tbl_cargo_hblformat';
import { SearchQuery } from '../models/Tbl_cargo_hblformat';
import { PageQuery } from '../../shared/models/pageQuery';

@Injectable({
    providedIn: 'root'
})
export class FormatPageService {

    private mdata$ = new BehaviorSubject<FormatModel>(null);
    get data$(): Observable<FormatModel> {
        return this.mdata$.asObservable();
    }
    private record: FormatModel;
   
    public id: string;
    public menuid: string;
    public param_type: string;

    public title: string;
    public isAdmin: boolean;
    public canAdd: boolean;
    public canEdit: boolean;
    public canSave: boolean;
    public isCompany: boolean;
    public canPrint: boolean;
    
    public initlialized: boolean;
    private appid = ''
    private db: FormatModel[] = [];
    constructor(
        private http2: HttpClient,
        private gs: GlobalService
    ) { }

    public init(params: any) {

        if (this.appid != this.gs.appid) {
            this.appid = this.gs.appid;
            this.initlialized = false;
            this.db = <FormatModel[]>[];
        }

        this.id = params.id;
        this.menuid = params.id;
        this.param_type = params.menu_param;

        if (!this.gs.isBlank(this.db[this.param_type]))
            this.record = <FormatModel>this.db[this.param_type];
        else
            this.record = <FormatModel>{
                errorMessage: '',
                records: [],
                searchQuery: <SearchQuery>{ searchString: '',format_id:'', format_name : '' },
                pageQuery: <PageQuery>{ action: 'NEW', page_count: 0, page_current: -1, page_rowcount: 0, page_rows: 0 }
            };

        this.mdata$.next(this.record);

        this.isCompany = this.gs.IsCompany(this.menuid);
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

        SearchData.FORMAT_ID = this.record.searchQuery.format_id;
        SearchData.page_rowcount = this.gs.ROWS_TO_DISPLAY;
        SearchData.CODE = this.record.searchQuery.searchString;
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
            this.record = <FormatModel>{
                records: [],
                errorMessage: this.gs.getError(error),
            }
            this.mdata$.next(this.record);
        });
    }

    

    SaveRecords() {

        if (!this.Allvalid())
            return;
        this.SaveParent();
        const saveRecord = <vm_Tbl_cargo_hblformat>{};
        saveRecord.format_id = this.record.searchQuery.format_id;
        saveRecord.records = this.record.records;
        saveRecord.userinfo = this.gs.UserInfo;

        this.Save(saveRecord)
            .subscribe(response => {
                if (response.retvalue == false) {
                    this.record.errorMessage = response.error;
                    this.mdata$.next(this.record);
                    alert(this.record.errorMessage);
                }
                else {
                    this.record.errorMessage = "Save Complete";
                    this.mdata$.next(this.record);
                    // alert(this.errorMessage);
                }

            }, error => {
                this.record.errorMessage = this.gs.getError(error);
                this.mdata$.next(this.record);
                alert(this.record.errorMessage);
            });
    }

    private SaveParent() {
        // this.record.cjm_pkid = this.pkid.toString();
        // this.record.cjm_customer_id = this.customer_id;
        // this.record.cjm_user_id = this.gs.user_pkid;
    }

    private Allvalid(): boolean {

        var bRet = true;
        this.record.errorMessage = "";
        this.mdata$.next(this.record);

        if (this.gs.isBlank(this.record.searchQuery.format_id)) {
            bRet = false;
            this.record.errorMessage = "Please select a format and continue...";
            this.mdata$.next(this.record);
            alert(this.record.errorMessage);
            return bRet;
        }
        if (this.gs.isBlank(this.record.records)) {
            bRet = false;
            this.record.errorMessage = "List Not Found";
            this.mdata$.next(this.record);
            alert(this.record.errorMessage);
            return bRet;
        }
        return bRet;
    }


    List(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Master/FormatPage/List', SearchData, this.gs.headerparam2('authorized'));
    }

    Save(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Master/FormatPage/Save', SearchData, this.gs.headerparam2('authorized'));
    }

    ListDet(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Master/FormatPage/ListDet', SearchData, this.gs.headerparam2('authorized'));
    }

    SaveDet(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Master/FormatPage/SaveDet', SearchData, this.gs.headerparam2('authorized'));
    }

    ReUpdateDet(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Master/FormatPage/ReUpdateDet', SearchData, this.gs.headerparam2('authorized'));
    }
}
