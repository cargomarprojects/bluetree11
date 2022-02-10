import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { GlobalService } from '../../core/services/global.service';
import { Tbl_Mast_Partym, PartyModel, vm_Tbl_Mast_Partym } from '../models/Tbl_Mast_Partym';
import { SearchQuery } from '../models/Tbl_Mast_Partym';
import { PageQuery } from '../../shared/models/pageQuery';

@Injectable({
    providedIn: 'root'
})
export class PartyService {

    private mdata$ = new BehaviorSubject<PartyModel>(null);
    get data$(): Observable<PartyModel> {
        return this.mdata$.asObservable();
    }
    private record: PartyModel;

    public id: string;
    public menuid: string;
    public param_type: string;

    public title: string;
    public isAdmin: boolean;
    public canAdd: boolean;
    public canEdit: boolean;
    public canSave: boolean;
    public isCompany: boolean;
    public canDelete: boolean;

    public initlialized: boolean;
    private appid = ''
    // private menutype: string = '';
    private db: PartyModel[] = [];

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
        this.record = <PartyModel>{
            selectedId: '',
            sortcol: 'gen_code',
            sortorder: true,
            errormessage: '',
            records: [],
            searchQuery: <SearchQuery>{
                searchString: '', searchSort: 'gen_short_name', searchState: '', searchCity: '', searchTel: '', searchFax: '', searchZip: '', searchBlackAc: false, menuType: this.param_type,
                searchDateBasedon: 'NA', searchSdate: '', searchEdate: '', searchCreatedBy: '', searchEditedBy: ''
            },
            pageQuery: <PageQuery>{ action: 'NEW', page_count: 0, page_current: -1, page_rowcount: 0, page_rows: 0 }
        };
        this.mdata$.next(this.record);
    }
    public init(params: any) {

        if (this.appid != this.gs.appid) {
            this.appid = this.gs.appid;
            this.initlialized = false;
            this.db = <PartyModel[]>[];
        }

        this.id = params.id;
        this.menuid = params.id;
        this.param_type = params.menu_param;

        if (!this.gs.isBlank(this.db[this.param_type]))
            this.record = <PartyModel>this.db[this.param_type];
        else
            this.record = <PartyModel>{
                selectedId: '',
                sortcol: 'gen_code',
                sortorder: true,
                errormessage: '',
                records: [],
                searchQuery: <SearchQuery>{
                    searchString: '', searchSort: 'gen_short_name', searchState: '', searchCity: '', searchTel: '', searchFax: '', searchZip: '', searchBlackAc: false, menuType: this.param_type,
                    searchDateBasedon: 'NA', searchSdate: '', searchEdate: '', searchCreatedBy: '', searchEditedBy: ''
                },
                pageQuery: <PageQuery>{ action: 'NEW', page_count: 0, page_current: -1, page_rowcount: 0, page_rows: 0 }
            };

        this.mdata$.next(this.record);

        this.isCompany = this.gs.IsCompany(this.menuid);
        this.isAdmin = this.gs.IsAdmin(this.menuid);
        this.title = this.gs.getTitle(this.menuid);
        this.canAdd = this.gs.canAdd(this.menuid);
        this.canEdit = this.gs.canEdit(this.menuid);
        this.canSave = this.canAdd || this.canEdit;
        this.canDelete = this.gs.canDelete(this.menuid);
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
        SearchData.outputformat = _searchdata.outputformat;
        SearchData.action = 'NEW';
        SearchData.pkid = this.id;
        // SearchData.TYPE = 'PARTYS';
        SearchData.TYPE = this.param_type;
        SearchData.page_rowcount = this.gs.ROWS_TO_DISPLAY;
        SearchData.CODE = this.record.searchQuery.searchString;
        SearchData.ISADMIN = this.isAdmin == true ? 'Y' : 'N';
        SearchData.ISCOMPANY = this.isCompany == true ? 'Y' : 'N';
        SearchData.SORT = this.record.searchQuery.searchSort;
        SearchData.STATE = this.record.searchQuery.searchState;
        SearchData.CITY = this.record.searchQuery.searchCity;
        SearchData.ZIP = this.record.searchQuery.searchZip;
        SearchData.TEL = this.record.searchQuery.searchTel;
        SearchData.FAX = this.record.searchQuery.searchFax;
        SearchData.BLACK_ACCOUNT = this.record.searchQuery.searchBlackAc == true ? 'Y' : 'N';
        SearchData.DATE_BASEDON = this.record.searchQuery.searchDateBasedon;
        SearchData.SDATE = this.record.searchQuery.searchSdate;
        SearchData.EDATE = this.record.searchQuery.searchEdate;
        SearchData.CREATED_BY = this.record.searchQuery.searchCreatedBy;
        SearchData.EDITED_BY = this.record.searchQuery.searchEditedBy;

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
            if (_searchdata.outputformat == "EXCEL") {
                this.Downloadfile(response.filename, response.filetype, response.filedisplayname);
            } else {
                this.record.pageQuery = <PageQuery>{ action: 'NEW', page_rows: response.page_rows, page_count: response.page_count, page_current: response.page_current, page_rowcount: response.page_rowcount };
                this.record.records = response.list;
                this.mdata$.next(this.record);

                this.db[this.param_type] = this.record;
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
    RefreshList(_rec: Tbl_Mast_Partym) {
        if (this.gs.isBlank(this.record))
            return;
        if (this.record.records == null)
            return;
        var REC = this.record.records.find(rec => rec.gen_pkid == _rec.gen_pkid);
        if (REC == null) {
            this.record.records.push(_rec);
        }
        else {
            REC.gen_short_name = _rec.gen_short_name;
            REC.gen_firm_code = _rec.gen_firm_code;
            REC.gen_type2 = _rec.gen_type2;
            REC.gen_address1 = _rec.gen_address1;
            REC.gen_country_name = _rec.gen_country_name;;
            REC.gen_state = _rec.gen_state;
            REC.gen_contact = _rec.gen_contact;
            REC.gen_tel = _rec.gen_tel;
            REC.gen_fax = _rec.gen_fax;
            REC.rec_created_by = _rec.rec_created_by;
        }
    }

    DeleteRow(_rec: Tbl_Mast_Partym) {

        if (!confirm("DELETE " + _rec.gen_short_name)) {
            return;
        }

        this.record.errormessage = '';
        var SearchData = this.gs.UserInfo;
        SearchData.pkid = _rec.gen_pkid;
        SearchData.remarks = _rec.gen_short_name;

        this.DeleteRecord(SearchData)
            .subscribe(response => {
                if (response.retvalue == false) {
                    this.record.errormessage = response.error;
                    alert(this.record.errormessage);
                }
                else {
                    this.record.records.splice(this.record.records.findIndex(rec => rec.gen_pkid == _rec.gen_pkid), 1);
                }
                this.mdata$.next(this.record);
            }, error => {
                this.record.errormessage = this.gs.getError(error);
                alert(this.record.errormessage);
                this.mdata$.next(this.record);
            });
    }


    List(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Master/Party/List', SearchData, this.gs.headerparam2('authorized'));
    }

    GetRecord(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Master/Party/GetRecord', SearchData, this.gs.headerparam2('authorized'));
    }

    LoadMissingData(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Master/Party/LoadMissingData', SearchData, this.gs.headerparam2('authorized'));
    }

    Save(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Master/Party/Save', SearchData, this.gs.headerparam2('authorized'));
    }
    DeleteRecord(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Master/Party/DeleteRecord', SearchData, this.gs.headerparam2('authorized'));
    }
}
