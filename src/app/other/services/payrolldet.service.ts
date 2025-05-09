import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { GlobalService } from '../../core/services/global.service';
import { Tbl_Cargo_Payrolldet, PayrolldetModel } from '../models/tbl_cargo_payrolldet';
import { SearchQuery } from '../models/tbl_cargo_payrolldet';
import { PageQuery } from '../../shared/models/pageQuery';


@Injectable({
    providedIn: 'root'
})
export class PayrollDetService {

    private mdata$ = new BehaviorSubject<PayrolldetModel>(null);
    get data$(): Observable<PayrolldetModel> {
        return this.mdata$.asObservable();
    }
    private record: PayrolldetModel;

    public id: string;
    public menuid: string;
    public mbl_type: string;
    public mbl_refno: string;
    public mbl_pkid: string;

    public title: string;
    public isAdmin: boolean;
    public canAdd: boolean;
    public canEdit: boolean;
    public canSave: boolean;
    public canDelete: boolean;

    public initlialized: boolean;
    private appid = ''

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
    public ClearInit() {
        this.record = <PayrolldetModel>{
            selectedId: '',
            errormessage: '',
            records: [],
            searchQuery: <SearchQuery>{ searchString: '', mbl_refno: this.mbl_refno, todate: '', mblid: this.mbl_pkid },
            pageQuery: <PageQuery>{ action: 'NEW', page_count: 0, page_current: -1, page_rowcount: 0, page_rows: 0 }
        };
        this.mdata$.next(this.record);
    }

    public init(params: any) {
        //this is invoke from list so every time refresh
        // if (this.appid != this.gs.appid) {
        //     this.appid = this.gs.appid;
        //     this.initlialized = false;
        // }
        // if (this.initlialized)
        //     return;
        const options = params;
        this.id = options.menuid;
        this.menuid = options.menuid;
        this.mbl_pkid = options.mbl_pkid;
        this.mbl_refno = options.mbl_refno;
        this.mbl_type = options.mbl_type;

        this.record = <PayrolldetModel>{
            selectedId: '',
            errormessage: '',
            records: [],
            searchQuery: <SearchQuery>{ searchString: '', mbl_refno: this.mbl_refno, todate: '', mblid: this.mbl_pkid },
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
        this.record.errormessage = '';
        
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
        SearchData.MBL_ID = this.mbl_pkid;
        SearchData.PDATE = this.record.searchQuery.todate;
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
            this.record.errormessage = this.gs.getError(error);
            this.mdata$.next(this.record);
            alert(this.record.errormessage);
        });
    }

    RefreshList(_rec: Tbl_Cargo_Payrolldet) {
        if (this.record.records == null)
            return;
        var REC = this.record.records.find(rec => rec.cpd_pkid == _rec.cpd_pkid);
        if (REC == null) {
            this.record.records.push(_rec);
        }
        else {
            // REC.obl_slno = _rec.obl_slno;
            // REC.obl_date = _rec.obl_date;
            // REC.obl_refno = _rec.obl_refno;
            // REC.obl_houseno = _rec.obl_houseno;
            // REC.obl_consignee_name = _rec.obl_consignee_name;
            // REC.obl_handled_name = _rec.obl_handled_name;
            // REC.obl_remark = _rec.obl_remark;
            // REC.rec_created_by = _rec.rec_created_by;
            // REC.rec_created_date = _rec.rec_created_date;
        }
    }

    DeleteRow(_rec: Tbl_Cargo_Payrolldet) {

        this.record.errormessage = '';
        if (!confirm("DELETE " + _rec.cpd_emp_name)) {
            return;
        }

        var SearchData = this.gs.UserInfo;
        SearchData.pkid = _rec.cpd_pkid;
        SearchData.remarks = _rec.cpd_emp_name;
        this.DeleteRecord(SearchData)
            .subscribe(response => {
                if (response.retvalue == false) {
                    this.record.errormessage = response.error;
                    alert(this.record.errormessage);
                }
                else {
                    this.record.records.splice(this.record.records.findIndex(rec => rec.cpd_pkid == _rec.cpd_pkid), 1);
                }
            }, error => {
                this.record.errormessage = this.gs.getError(error);
                alert(this.record.errormessage);
            });
    }

    Generate(_searchdata: any) {

        this.record.errormessage = '';
        this.mdata$.next(this.record);
        if (this.gs.isBlank(_searchdata.searchQuery.todate)) {
            this.record.errormessage = 'Payroll Date cannot be blank';
            this.mdata$.next(this.record);
            return;
        }

        if (!confirm("Generate Records...")) {
            return;
        }

        var SearchData = this.gs.UserInfo;
        SearchData.MBL_ID = this.mbl_pkid;
        SearchData.PDATE = _searchdata.searchQuery.todate;
        this.GenerateRecord(SearchData)
            .subscribe(response => {
                if (response.retvalue == false) {
                    this.record.errormessage = response.error;
                    alert(this.record.errormessage);
                }
                else {
                    this.Search(_searchdata, 'SEARCH');
                }
            }, error => {
                this.record.errormessage = this.gs.getError(error);
                alert(this.record.errormessage);
            });
    }

    List(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Other/PayrollDet/List', SearchData, this.gs.headerparam2('authorized'));
    }

    GetRecord(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Other/PayrollDet/GetRecord', SearchData, this.gs.headerparam2('authorized'));
    }


    DeleteRecord(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Other/PayrollDet/Delete', SearchData, this.gs.headerparam2('authorized'));
    }

    Save(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Other/PayrollDet/Save', SearchData, this.gs.headerparam2('authorized'));
    }

    GenerateRecord(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Other/PayrollDet/GenerateRecord', SearchData, this.gs.headerparam2('authorized'));
    }

}
