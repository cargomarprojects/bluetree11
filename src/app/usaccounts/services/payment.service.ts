import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { GlobalService } from '../../core/services/global.service';
import { Tbl_Acc_Payment, AccPaymentModel } from '../models/Tbl_Acc_Payment';
import { SearchQuery } from '../models/Tbl_Acc_Payment';
import { PageQuery } from '../../shared/models/pageQuery';

@Injectable({
    providedIn: 'root'
})
export class PaymentService {

    private mdata$ = new BehaviorSubject<AccPaymentModel>(null);
    get data$(): Observable<AccPaymentModel> {
        return this.mdata$.asObservable();
    }
    private record: AccPaymentModel;

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

        this.record = <AccPaymentModel>{
            errormessage: '',
            records: [],
            searchQuery: <SearchQuery> { searchType : 'CHECK NO',  searchString: '',searchCustType:'CUSTOMER'},
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
        }
        if (type == 'PAGE') {
            this.record.pageQuery = _searchdata.pageQuery;
        }

        var SearchData = this.gs.UserInfo;
        SearchData.outputformat = 'SCREEN';
        SearchData.action = 'NEW';
        SearchData.pkid = this.id;
        SearchData.TYPE = 'PAYMENT';
        SearchData.page_rowcount = this.gs.ROWS_TO_DISPLAY;
        SearchData.FDATE = this.record.searchQuery.sdate;
        SearchData.EDATE = this.record.searchQuery.edate;
        SearchData.YEAR = this.gs.year_code;
        SearchData.SEARCHTYPE = this.record.searchQuery.searchType;  
        SearchData.SEARCH_CUST_TYPE = this.record.searchQuery.searchCustType; 
        SearchData.CODE = this.record.searchQuery.searchString;        
        SearchData.ISADMIN = 'N';
        SearchData.BR_REGION = this.gs.BRANCH_REGION ;
        SearchData.HIDE_PAYROLL = this.gs.user_hide_payroll;
        SearchData.CUSTOMER_ID = this.record.searchQuery.customerId; 

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
            this.record = <AccPaymentModel>{
                records: [],
                errormessage: this.gs.getError(error),
            }
            this.mdata$.next(this.record);
        });
    }

    RefreshList(_rec: Tbl_Acc_Payment) {
        if (this.record.records == null)
            return;
        var REC = this.record.records.find(rec => rec.pay_pkid == _rec.pay_pkid);
        if (REC == null) {
            this.record.records.push(_rec);
        }
        else {
            REC.pay_docno = _rec.pay_docno;
            REC.pay_date = _rec.pay_date;
            REC.pay_acc_name = _rec.pay_acc_name;
            
            REC.pay_diff = _rec.pay_diff;
            REC.pay_tot_chq = _rec.pay_tot_chq;
            REC.pay_posted = _rec.pay_posted;
            REC.pay_narration = _rec.pay_narration;
            REC.rec_created_by = _rec.rec_created_by;
            REC.rec_created_date = _rec.rec_created_date;
            REC.rec_closed = _rec.rec_closed;
        }
    }
    
    DeleteRow(_rec: Tbl_Acc_Payment) {

        this.record.errormessage = '';
        if (!confirm("DELETE " + _rec.pay_docno)) {
            return;
        }

        var SearchData = this.gs.UserInfo;
        SearchData.pkid = _rec.pay_pkid;
        SearchData.remarks = _rec.pay_narration;

        this.DeleteRecord(SearchData)
            .subscribe(response => {
                if (response.retvalue == false) {
                    this.record.errormessage = response.error;
                    alert(this.record.errormessage);
                }
                else {
                    this.record.records.splice(this.record.records.findIndex(rec => rec.pay_pkid == _rec.pay_pkid), 1);
                }
            }, error => {
                this.record.errormessage = this.gs.getError(error);
                alert(this.record.errormessage);
            });
    }


    List(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Payment/List', SearchData, this.gs.headerparam2('authorized'));
    }

    GetRecord(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Payment/GetRecord', SearchData, this.gs.headerparam2('authorized'));
    }


    PendingList(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Payment/PendingList', SearchData, this.gs.headerparam2('authorized'));
    }

    GetNextChqNo(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/FundTransfer/GetNextChqNo', SearchData, this.gs.headerparam2('authorized'));
    }

    

    DeleteRecord(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Payment/Delete', SearchData, this.gs.headerparam2('authorized'));
    }


    Save(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Payment/Save', SearchData, this.gs.headerparam2('authorized'));
    }

    InvoiceList(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + "/api/UsAccRptArApList/PayReqArApList", SearchData, this.gs.headerparam2('authorized'));
      }

}
