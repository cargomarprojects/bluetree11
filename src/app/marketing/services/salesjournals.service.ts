import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { GlobalService } from '../../core/services/global.service';
import { Tbl_Cargo_Journals_Master, SalesJournalModel, vm_Tbl_Cargo_Journals_Master } from '../models/tbl_cargo_journals_master';
import { SearchQuery } from '../models/tbl_cargo_journals_master';
import { PageQuery } from '../../shared/models/pageQuery';

@Injectable({
    providedIn: 'root'
})
export class SalesJournalService {

    private mdata$ = new BehaviorSubject<SalesJournalModel>(null);
    get data$(): Observable<SalesJournalModel> {
        return this.mdata$.asObservable();
    }
    private record: SalesJournalModel;

    public id: string;
    public menuid: string;
    public param_type: string;

    public title: string;
    public isAdmin: boolean;
    public isCompany: boolean;
    public canAdd: boolean;
    public canEdit: boolean;
    public canSave: boolean;
    public canDelete: boolean;

    public initlialized: boolean;
    private LSESSION = 0;
    
    constructor(
        private http2: HttpClient,
        private gs: GlobalService
    ) { }

    public ClearInit() {
        this.record = <SalesJournalModel>{
            errormessage: '',
            records: [],
            searchQuery: <SearchQuery>{ searchString: '' },
            pageQuery: <PageQuery>{ action: 'NEW', page_count: 0, page_current: -1, page_rowcount: 0, page_rows: 0 }
        };
        this.mdata$.next(this.record);
    }
    public init(params: any) {
        if (this.LSESSION < this.gs.GSESSION) {
            this.LSESSION = this.gs.GSESSION;
            this.initlialized = false;
        }
        if (this.initlialized)
            return;

        this.id = params.id;
        this.menuid = params.id;
        this.param_type = "MARKETING";  //params.menu_param;
        this.record = <SalesJournalModel>{
            errormessage: '',
            records: [],
            searchQuery: <SearchQuery>{ searchString: '' },
            pageQuery: <PageQuery>{ action: 'NEW', page_count: 0, page_current: -1, page_rowcount: 0, page_rows: 0 }
        };

        this.mdata$.next(this.record);

        this.isAdmin = this.gs.IsAdmin(this.menuid);
        this.isCompany = this.gs.IsCompany(this.menuid);
        this.title = this.gs.getTitle(this.menuid);
        this.canAdd = this.gs.canAdd(this.menuid);
        this.canEdit = this.gs.canEdit(this.menuid);
        this.canSave = this.canAdd || this.canEdit;
        this.canDelete = this.gs.canDelete(this.menuid);

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
        SearchData.outputformat = 'SCREEN';
        SearchData.action = 'NEW';
        SearchData.pkid = this.id;
        SearchData.page_rowcount = this.gs.ROWS_TO_DISPLAY;
        SearchData.CODE = this.record.searchQuery.searchString;
        SearchData.TYPE = this.param_type;
        SearchData.ISADMIN = this.isAdmin == true ? "Y" : "N";
        SearchData.ISCOMPANY = this.isCompany == true ? "Y" : "N";
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
            this.record = <SalesJournalModel>{
                records: [],
                errormessage: this.gs.getError(error),
            }
            this.mdata$.next(this.record);
        });
    }

    RefreshList(_rec: Tbl_Cargo_Journals_Master) {
        if (this.record.records == null)
            return;
        // var REC = this.record.records.find(rec => rec.qtnr_pkid == _rec.qtnr_pkid);
        // if (REC == null) {
        //     this.record.records.push(_rec);
        // }
        // else {

        //     REC.qtnr_agent_name = _rec.qtnr_agent_name;
        //     REC.qtnr_pol_cntry_name = _rec.qtnr_pol_cntry_name;
        //     REC.qtnr_pod_cntry_name = _rec.qtnr_pod_cntry_name;
        //     REC.qtnr_mode = _rec.qtnr_mode;
        //     REC.qtnr_validity = _rec.qtnr_validity;
        //     REC.qtnr_file_name = _rec.qtnr_file_name;
        //     REC.qtnr_file_name = _rec.qtnr_file_name;
        // }
    }

    DeleteRow(_rec: Tbl_Cargo_Journals_Master) {

        this.record.errormessage = '';
        if (!confirm("DELETE " + _rec.cjm_customer_name)) {
            return;
        }

        var SearchData = this.gs.UserInfo;
        SearchData.pkid = _rec.cjm_pkid;
        SearchData.remarks = _rec.cjm_customer_name;
        this.DeleteRecord(SearchData)
            .subscribe(response => {
                if (response.retvalue == false) {
                    this.record.errormessage = response.error;
                    alert(this.record.errormessage);
                }
                else {
                    this.record.records.splice(this.record.records.findIndex(rec => rec.cjm_pkid == _rec.cjm_pkid), 1);
                }
            }, error => {
                this.record.errormessage = this.gs.getError(error);
                alert(this.record.errormessage);
            });
    }


    List(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Marketing/SalesJournals/List', SearchData, this.gs.headerparam2('authorized'));
    }

    GetRecord(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Marketing/SalesJournals/GetRecord', SearchData, this.gs.headerparam2('authorized'));
    }

    LoadCustomerRecord(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Marketing/SalesJournals/LoadCustomerRecord', SearchData, this.gs.headerparam2('authorized'));
    }

    Save(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Marketing/SalesJournals/Save', SearchData, this.gs.headerparam2('authorized'));
    }

    DeleteRecord(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Marketing/SalesJournals/DeleteRecord', SearchData, this.gs.headerparam2('authorized'));
    }



}
