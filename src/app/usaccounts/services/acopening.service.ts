import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, BehaviorSubject } from 'rxjs';

import { GlobalService } from '../../core/services/global.service';
import { Tbl_Acc_Opening, AccOpeningModel } from '../models/Tbl_Acc_Opening';
import { SearchQuery } from '../models/Tbl_Acc_Opening';
import { PageQuery } from '../../shared/models/pageQuery';


@Injectable({
    providedIn: 'root'
})
export class AcOpeningService {

    private mdata$ = new BehaviorSubject<AccOpeningModel>(null);
    get data$(): Observable<AccOpeningModel> {
        return this.mdata$.asObservable();
    }
    private record: AccOpeningModel;

    public id: string;
    public menuid: string;
    public param_type: string;

    public title: string;
    public isAdmin: boolean;
    public canAdd: boolean;
    public canEdit: boolean;
    public canSave: boolean;

    public initlialized: boolean;
    private LSESSION = 0;

    constructor(
        private http2: HttpClient,
        private gs: GlobalService
    ) { }

    public init(params: any) {
        if (this.LSESSION < this.gs.GSESSION)
        {
            this.LSESSION = this.gs.GSESSION;
            this.initlialized = false;
        }
        if (this.initlialized)
            return;

        this.id = params.id;
        this.menuid = params.id;
        this.param_type = params.param_type;

        this.record = <AccOpeningModel>{
            errormessage: '',
            records: [],
            searchQuery: <SearchQuery>{ searchString: '', balance :''},
            pageQuery: <PageQuery>{ action: 'NEW', page_count: 0, page_current: -1, page_rowcount: 0, page_rows: 0 }
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
        }
        if (type == 'PAGE') {
            this.record.pageQuery = _searchdata.pageQuery;
        }

        var SearchData = this.gs.UserInfo;
        SearchData.outputformat = 'SCREEN';
        SearchData.action = 'NEW';
        SearchData.pkid = this.id;

        SearchData.TYPE = "OP";
        SearchData.YEAR = this.gs.year_code;
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
            var nBal = response.TotDr - response.TotCr;
            this.record.searchQuery.balance= `DR:${response.TotDr} - CR:${response.TotCr} BAL:${nBal}`;
            this.mdata$.next(this.record);
        }, error => {
            this.record = <AccOpeningModel>{
                records: [],
                errormessage: this.gs.getError(error),
            }
            this.mdata$.next(this.record);
        });
    }

    RefreshList(_rec: Tbl_Acc_Opening) {
        if (this.record.records == null)
            return;
        var REC = this.record.records.find(rec => rec.op_pkid == _rec.op_pkid);
        if (REC == null) {
            this.record.records.push(_rec);
        }
        else {
            REC.op_docno = _rec.op_docno;
            REC.op_date = _rec.op_date;
            REC.op_acc_name = _rec.op_acc_name;

            REC.op_famt = _rec.op_famt;
            REC.op_curr_code = _rec.op_curr_code;

            REC.op_dr = _rec.op_dr;
            REC.op_cr = _rec.op_cr;
            REC.op_cust_name = _rec.op_cust_name;
            REC.op_invno = _rec.op_invno;

            REC.op_invdate   = _rec.op_invdate;
            REC.op_mbl_refno = _rec.op_mbl_refno;
            REC.op_inv_refno = _rec.op_inv_refno;

            REC.rec_closed = _rec.rec_closed;
            REC.rec_created_by = _rec.rec_created_by;            
        }
    }
    
    List(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/AcOpen/List', SearchData, this.gs.headerparam2('authorized'));
    }

    GetRecord(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/AcOpen/GetRecord', SearchData, this.gs.headerparam2('authorized'));
    }

    Save(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/AcOpen/Save', SearchData, this.gs.headerparam2('authorized'));
    }

}
