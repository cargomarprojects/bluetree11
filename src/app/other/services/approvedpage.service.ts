import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { GlobalService } from '../../core/services/global.service';
import { Tbl_Cargo_Approved, ApprovedPageModel, vm_tbl_cargo_approved } from '../models/tbl_cargo_approved';
import { SearchQuery } from '../models/tbl_cargo_approved';
import { PageQuery } from '../../shared/models/pageQuery';

@Injectable({
    providedIn: 'root'
})
export class ApprovedPageService {

    private mdata$ = new BehaviorSubject<ApprovedPageModel>(null);
    get data$(): Observable<ApprovedPageModel> {
        return this.mdata$.asObservable();
    }
    private record: ApprovedPageModel;

    public id: string;
    public menuid: string;
    public param_type: string;
    public mblid: string = '';

    public title: string;
    public isAdmin: boolean;
    public canAdd: boolean;
    public canEdit: boolean;
    public canSave: boolean;

    public initlialized: boolean;
    private appid = ''
    private db: ApprovedPageModel[] = [];

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
        this.record = <ApprovedPageModel>{
            selectedId : '',
            sortcol: 'ca_reqno',
            sortorder: true,
            errormessage: '',
            records: [],
            searchQuery: <SearchQuery>{ searchString: '', fromDate: this.gs.getPreviousDate(this.gs.SEARCH_DATE_DIFF), toDate: this.gs.defaultValues.today, sortParameter: 'a.rec_created_date', isHidden: false, caType: 'ALL', userName: '', userId: '', userLovDisabled: true, userLovCaption: 'Request./Aprvd.By' },
            pageQuery: <PageQuery>{ action: 'NEW', page_count: 0, page_current: -1, page_rowcount: 0, page_rows: 0 }
        };
        this.mdata$.next(this.record);
    }
    public init(params: any) {

        let usrid: string = '';
        let usrname: string = '';

        if (this.appid != this.gs.appid) {
            this.appid = this.gs.appid;
            this.initlialized = false;
            this.db = <ApprovedPageModel[]>[];
        }

        this.id = params.id;
        this.menuid = params.menuid;
        this.param_type = params.menu_param;

        if (this.param_type != 'APPROVED') {
            usrid = this.gs.user_pkid;
            usrname = this.gs.user_name;
        }

        if (!this.gs.isBlank(this.db[this.param_type]))
            this.record = <ApprovedPageModel>this.db[this.param_type];
        else
            this.record = <ApprovedPageModel>{
                selectedId : '',
                sortcol: 'ca_reqno',
                sortorder: true,
                errormessage: '',
                records: [],
                searchQuery: <SearchQuery>{ searchString: '', fromDate: this.gs.getPreviousDate(this.gs.SEARCH_DATE_DIFF), toDate: this.gs.defaultValues.today, sortParameter: 'a.rec_created_date', isHidden: false, caType: 'ALL', userName: usrname, userId: usrid, userLovDisabled: true, userLovCaption: 'Request./Aprvd.By' },
                pageQuery: <PageQuery>{ action: 'NEW', page_count: 0, page_current: -1, page_rowcount: 0, page_rows: 0 }
            };

        this.mdata$.next(this.record);

        this.isAdmin = this.gs.IsAdmin(this.menuid);
        this.title = this.gs.getTitle(this.menuid);
        this.canAdd = this.gs.canAdd(this.menuid);
        this.canEdit = this.gs.canEdit(this.menuid);
        this.canSave = this.canAdd || this.canEdit;

        this.record.searchQuery.userLovDisabled = true;
        if (this.isAdmin || this.param_type == 'APPROVED')
            this.record.searchQuery.userLovDisabled = false;

        this.record.searchQuery.userLovCaption = 'Request./Aprvd.By';
        if (this.param_type == 'REQUEST REPORT')
            this.record.searchQuery.userLovCaption = 'Request.By';
        else if (this.param_type == 'APPROVED REPORT')
            this.record.searchQuery.userLovCaption = 'Approved.By';
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
        SearchData.page_rowcount = this.gs.ROWS_TO_DISPLAY;
        SearchData.page_count = 0;
        SearchData.page_rows = 0;
        SearchData.page_current = -1;
        SearchData.STYPE = this.record.searchQuery.caType;
        SearchData.CODE = this.record.searchQuery.searchString;
        SearchData.REQ_TYPE = this.param_type;
        SearchData.ISADMIN = this.isAdmin ? 'Y' : 'N';
        SearchData.IS_HIDDEN = this.record.searchQuery.isHidden ? 'Y' : 'N';
        SearchData.SORT = this.record.searchQuery.sortParameter;
        SearchData.SDATE = this.record.searchQuery.fromDate;
        SearchData.EDATE = this.record.searchQuery.toDate;
        SearchData.REQUEST_ID = this.record.searchQuery.userId;
        SearchData.MBLID = (this.mblid == null || this.mblid == undefined) ? '' : this.mblid;

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

            this.db[this.param_type] = this.record;

        }, error => {
            this.record.errormessage = this.gs.getError(error);
            this.mdata$.next(this.record);
            alert(this.record.errormessage);
        });
    }

    ShowHide(_rec: Tbl_Cargo_Approved) {

        if (!confirm(_rec.ca_hide_status + " RECORD")) {
            return;
        }

        this.record.errormessage = '';
        var SearchData = this.gs.UserInfo;
        SearchData.STYPE = _rec.ca_hide_status;
        SearchData.REQ_TYPE = this.param_type;
        SearchData.ISADMIN = this.isAdmin == true ? "Y" : "N";
        SearchData.CA_ID = _rec.ca_pkid;
        SearchData.CAD_ID = _rec.ca_cad_pkid;

        this.ShowHideRecord(SearchData)
            .subscribe(response => {
                if (response.retvalue == false) {
                    this.record.errormessage = response.error;
                    alert(this.record.errormessage);
                }
                else {

                    let temprecords: Tbl_Cargo_Approved[];
                    temprecords = <Tbl_Cargo_Approved[]>[];
                    temprecords = <Tbl_Cargo_Approved[]>this.record.records;
                    this.record.records = <Tbl_Cargo_Approved[]>[];
                    if (temprecords != null) {
                        temprecords.forEach(rec => {
                            if ((this.param_type == "APPROVED" || this.param_type == "APPROVED REPORT") && this.isAdmin == false) {
                                if (rec.ca_cad_pkid != _rec.ca_cad_pkid)
                                    this.record.records.push(rec)
                            }
                            else {
                                if (rec.ca_pkid != _rec.ca_pkid)
                                    this.record.records.push(rec)
                            }
                        });
                    }
                }
                this.mdata$.next(this.record);
            }, error => {
                this.record.errormessage = this.gs.getError(error);
                this.mdata$.next(this.record);
                alert(this.record.errormessage);
            });

    }


    GeneralList(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Other/ApprovedPage/GeneralList', SearchData, this.gs.headerparam2('authorized'));
    }
    List(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Other/ApprovedPage/List', SearchData, this.gs.headerparam2('authorized'));
    }

    GetRecord(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Other/ApprovedPage/GetRecord', SearchData, this.gs.headerparam2('authorized'));
    }

    Save(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Other/ApprovedPage/Save', SearchData, this.gs.headerparam2('authorized'));
    }

    Savedet(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Other/ApprovedPage/Savedet', SearchData, this.gs.headerparam2('authorized'));
    }

    GetHblInvList(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Other/ApprovedPage/GetHblInvList', SearchData, this.gs.headerparam2('authorized'));
    }

    ShowHideRecord(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Other/ApprovedPage/ShowHideRecord', SearchData, this.gs.headerparam2('authorized'));
    }

    DeleteRecord(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Other/ApprovedPage/DeleteRecord', SearchData, this.gs.headerparam2('authorized'));
    }
}
