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

    public initlialized: boolean;
    private LSESSION = 0;
    private menutype: string = '';

    constructor(
        private http2: HttpClient,
        private gs: GlobalService
    ) { }

    public ClearInit() {
        this.menutype = '';
        this.gs.PARTYPAGE_INIT_PARTYS = null;
        this.gs.PARTYPAGE_INIT_OVERSEAAGENT = null;
        this.record = <PartyModel>{
            errormessage: '',
            records: [],
            searchQuery: <SearchQuery>{ searchString: '', searchSort: 'gen_short_name', searchState: '', searchCity: '', searchTel: '', searchFax: '', searchZip: '', searchBlackAc: false, menuType: this.param_type },
            pageQuery: <PageQuery>{ action: 'NEW', page_count: 0, page_current: -1, page_rowcount: 0, page_rows: 0 }
        };
        this.mdata$.next(this.record);
    }
    public init(params: any) {

        if (this.LSESSION < this.gs.GSESSION) {
            this.LSESSION = this.gs.GSESSION;
            this.initlialized = false;
            this.menutype = '';
            this.gs.PARTYPAGE_INIT_PARTYS = null;
            this.gs.PARTYPAGE_INIT_OVERSEAAGENT = null;
        }

        this.id = params.id;
        this.menuid = params.id;
        this.param_type = params.menu_param;

        if (this.menutype != this.param_type) {
            this.menutype = this.param_type;

            if (this.menutype == 'PARTYS' && !this.gs.isBlank(this.gs.PARTYPAGE_INIT_PARTYS))
                this.record = this.gs.PARTYPAGE_INIT_PARTYS;
            else if (this.menutype == 'OVERSEAAGENT' && !this.gs.isBlank(this.gs.PARTYPAGE_INIT_OVERSEAAGENT))
                this.record = this.gs.PARTYPAGE_INIT_OVERSEAAGENT;
            else
                this.record = <PartyModel>{
                    errormessage: '',
                    records: [],
                    searchQuery: <SearchQuery>{ searchString: '', searchSort: 'gen_short_name', searchState: '', searchCity: '', searchTel: '', searchFax: '', searchZip: '', searchBlackAc: false, menuType: this.param_type },
                    pageQuery: <PageQuery>{ action: 'NEW', page_count: 0, page_current: -1, page_rowcount: 0, page_rows: 0 }
                };

            this.mdata$.next(this.record);

            if (this.menutype == 'PARTYS')
                this.gs.PARTYPAGE_INIT_PARTYS = this.record;
            else if (this.menutype == 'OVERSEAAGENT')
                this.gs.PARTYPAGE_INIT_OVERSEAAGENT = this.record;
        }

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
            this.record = <PartyModel>{
                records: [],
                errormessage: this.gs.getError(error),
            }
            this.mdata$.next(this.record);
        });
    }

    RefreshList(_rec: Tbl_Mast_Partym) {
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

}
