import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { GlobalService } from '../../core/services/global.service';
import { Tbl_acc_ledger, BankReconModel, vm_Tbl_acc_ledger } from '../models/Tbl_acc_ledger';
import { SearchQuery } from '../models/Tbl_acc_ledger';
import { PageQuery } from '../../shared/models/pageQuery';
import { toDate } from '@angular/common/src/i18n/format_date';

@Injectable({
    providedIn: 'root'
})
export class BankReconService {

    private mdata$ = new BehaviorSubject<BankReconModel>(null);
    get data$(): Observable<BankReconModel> {
        return this.mdata$.asObservable();
    }
    private record: BankReconModel;

    public id: string;
    public menuid: string;
    public param_type: string;

    public title: string;
    public isAdmin: boolean;
    public canAdd: boolean;
    public canEdit: boolean;
    public canSave: boolean;
    public canDelete: boolean;
    public canPrint: boolean;

    nOPDR: number = 0;
    nOPCR: number = 0;
    nDR: number = 0;
    nCR: number = 0;

    private selectedRec: Tbl_acc_ledger = null;
    private THIS_POSTED_DATE: string = null;
    private OLD_POSTED_DATE: string = null;
    private OLD_POSTED: string = "N";
    private old_debit: number = 0;
    private old_credit: number = 0;

    public recon_jv_date: string = '';
    public Lbl_ReconCaption: string = '';

    public initlialized: boolean;
    private New_Search: string = 'N';

    constructor(
        private http2: HttpClient,
        private gs: GlobalService
    ) { }

    public init(params: any) {
        if (this.initlialized)
            return;

        this.id = params.id;
        this.menuid = params.id;
        this.param_type = params.param_type;

        this.record = <BankReconModel>{
            errormessage: '',
            records: [],
            searchQuery: <SearchQuery>{ sdate: this.gs.getPreviousDate(this.gs.SEARCH_DATE_DIFF), edate: this.gs.defaultValues.today, accId: '', accCode: '', accName: '', sdate2: '', edate2: '', chkreconciled: false, chkunreconciled: true, lbl_balance: '', lbl_op: '', lbl_trans_cr: '', lbl_trans_dr: '' },
            pageQuery: <PageQuery>{ action: 'NEW', page_count: 0, page_current: -1, page_rowcount: 0, page_rows: 0 }
        };

        this.mdata$.next(this.record);

        this.isAdmin = this.gs.IsAdmin(this.menuid);
        this.title = this.gs.getTitle(this.menuid);
        this.canAdd = this.gs.canAdd(this.menuid);
        this.canEdit = this.gs.canEdit(this.menuid);
        this.canDelete = this.gs.canDelete(this.menuid);
        this.canSave = this.canAdd || this.canEdit;
        this.canPrint = this.gs.canPrint(this.menuid);
        this.initlialized = true;

    }

    Search(_searchdata: any, type: string = '') {
        if (_searchdata.outputformat === 'SCREEN')
            this.New_Search = "N";
        else if (_searchdata.outputformat === 'PASSBOOK-BAL') {
            this.New_Search = "Y";
            this.record.searchQuery = _searchdata.searchQuery;
            this.FindBankBalance();
            return;
        }

        if (type == 'SEARCH') {
            this.record.searchQuery = _searchdata.searchQuery;
        }
        if (type == 'PAGE') {
            if (this.New_Search == "Y")
                return;
            this.record.pageQuery = _searchdata.pageQuery;
        }

        var SearchData = this.gs.UserInfo;
        SearchData.outputformat = 'SCREEN';
        SearchData.action = 'NEW';
        SearchData.pkid = this.id;

        SearchData.page_rowcount = this.gs.ROWS_TO_DISPLAY;

        SearchData.ACC_ID = this.record.searchQuery.accId;
        SearchData.RECONCILED = this.record.searchQuery.chkreconciled == true ? "Y" : "N";
        SearchData.UNRECONCILED = this.record.searchQuery.chkunreconciled == true ? "Y" : "N";
        SearchData.DATE1 = this.record.searchQuery.sdate2;
        SearchData.DATE2 = this.record.searchQuery.edate2;
        SearchData.BRCODE = this.gs.branch_code;

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
            this.record.errormessage = this.gs.getError(error),
                this.mdata$.next(this.record);
        });
    }

    FindBankBalance() {
        this.record.errormessage = '';
        this.nOPDR = 0;
        this.nOPCR = 0;
        this.nDR = 0;
        this.nCR = 0;
        var SearchData = this.gs.UserInfo;
        SearchData.BRCODE = this.gs.branch_code;
        SearchData.ACCID = this.record.searchQuery.accId;
        SearchData.SDATE = this.record.searchQuery.sdate;
        SearchData.EDATE = this.record.searchQuery.edate
        this.GetPassbookBalance(SearchData)
            .subscribe(response => {
                this.nOPDR = response.nDebit_op;
                this.nOPCR = response.nCredit_op;
                this.nDR = response.nDr;
                this.nCR = response.nCr;

                this.ShowBalance();
                this.ResetPageControl();
                this.mdata$.next(this.record);
            }, error => {
                this.record.errormessage = this.gs.getError(error);
                alert(this.record.errormessage);
                this.mdata$.next(this.record);
            });
    }

    ShowBalance() {

        let nAmt: number = 0;

        this.record.searchQuery.lbl_op = "";
        this.record.searchQuery.lbl_trans_dr = "";
        this.record.searchQuery.lbl_trans_cr = "";
        this.record.searchQuery.lbl_balance = "";

        nAmt = this.nOPDR - this.nOPCR;
        nAmt = this.gs.roundNumber(nAmt, 2);
        if (nAmt > 0)
            this.record.searchQuery.lbl_op = nAmt.toString() + " DR";
        else if (nAmt < 0)
            this.record.searchQuery.lbl_op = Math.abs(nAmt).toString() + " CR";

        if (this.nDR != 0)
            this.record.searchQuery.lbl_trans_dr = this.nDR.toString() + " DR";
        if (this.nCR != 0)
            this.record.searchQuery.lbl_trans_cr = this.nCR.toString() + " CR";

        nAmt = (this.nDR + this.nOPDR) - (this.nCR + this.nOPCR);
        nAmt = this.gs.roundNumber(nAmt, 2);

        if (nAmt > 0)
            this.record.searchQuery.lbl_balance = nAmt.toString() + " DR";
        else if (nAmt < 0)
            this.record.searchQuery.lbl_balance = Math.abs(nAmt).toString() + " CR";
    }

    ResetPageControl() {
        this.record.records = <Tbl_acc_ledger[]>[];
        this.record.pageQuery.action = 'NEW';
        this.record.pageQuery.page_count = 0;
        this.record.pageQuery.page_current = -1;
        this.record.pageQuery.page_rowcount = 0;
        this.record.pageQuery.page_rows = 0;
    }

    ReconcileRecord(_rec: Tbl_acc_ledger) {
        this.selectedRec = _rec;

        if (_rec.jv_posted_date == null) {
            this.OLD_POSTED_DATE = null;
            this.OLD_POSTED = "N";
        }
        else {
            this.OLD_POSTED_DATE = _rec.jv_posted_date;
            this.OLD_POSTED = "Y";
        }

        this.old_debit = 0;
        this.old_credit = 0;
        if (_rec.jv_debit != null)
            this.old_debit = _rec.jv_debit;
        if (_rec.jv_credit != null)
            this.old_credit = _rec.jv_credit;

        if (this.OLD_POSTED_DATE == null) {
            this.Lbl_ReconCaption = "Enter Date To Reconcile";
            this.recon_jv_date = _rec.jv_date;
        }
        else {
            this.Lbl_ReconCaption = "Reconciled, Remove the date to UN-Reconcile";
            this.recon_jv_date = this.OLD_POSTED_DATE;
        }

    }

    SaveDate() {
        this.record.errormessage = '';
        this.mdata$.next(this.record);
        this.selectedRec.jv_posted_date = this.recon_jv_date;
        this.THIS_POSTED_DATE = this.recon_jv_date;
        const saveRecord = <vm_Tbl_acc_ledger>{};
        saveRecord.record = this.selectedRec;
        saveRecord.userinfo = this.gs.UserInfo;
        this.SaveReconDate(saveRecord)
            .subscribe(response => {
                if (response.retvalue == false) {
                    this.record.errormessage = response.error;
                    alert(this.record.errormessage);
                }
                else {

                    this.ReCalculate();
                    if (this.record.records != null) {
                        var REC = this.record.records.find(rec => rec.jv_pkid == this.selectedRec.jv_pkid);
                        if (REC != null) {
                            REC.jv_posted_date = this.selectedRec.jv_posted_date;
                            this.mdata$.next(this.record);
                        }
                    }
                }
            }, error => {
                this.record.errormessage = this.gs.getError(error);
                alert(this.record.errormessage);
                this.mdata$.next(this.record);
            });
    }
    ReCalculate() {
        if (this.OLD_POSTED == "N" && this.THIS_POSTED_DATE == null)
            return;

        if (this.OLD_POSTED == "Y") {

            if (this.OLD_POSTED_DATE == "" || this.OLD_POSTED_DATE == null || this.OLD_POSTED_DATE == undefined)
                return;
            if (this.record.searchQuery.sdate == "" || this.record.searchQuery.sdate == null || this.record.searchQuery.sdate == undefined)
                return;
            if (this.record.searchQuery.edate == "" || this.record.searchQuery.edate == null || this.record.searchQuery.edate == undefined)
                return;

            let oldPostedDate = this.GetDates(this.OLD_POSTED_DATE);
            let FromDate = this.GetDates(this.record.searchQuery.sdate);
            let ToDate = this.GetDates(this.record.searchQuery.edate);

            if (oldPostedDate < FromDate) {
                this.nOPDR -= this.old_debit;
                this.nOPCR -= this.old_credit;
            }
            else if (oldPostedDate >= FromDate && oldPostedDate <= ToDate) {
                this.nDR -= this.old_debit;
                this.nCR -= this.old_credit;
            }
            this.ShowBalance();
        }
        if (this.THIS_POSTED_DATE != null) {

            if (this.THIS_POSTED_DATE == "" || this.THIS_POSTED_DATE == null || this.THIS_POSTED_DATE == undefined)
                return;
            if (this.record.searchQuery.sdate == "" || this.record.searchQuery.sdate == null || this.record.searchQuery.sdate == undefined)
                return;
            if (this.record.searchQuery.edate == "" || this.record.searchQuery.edate == null || this.record.searchQuery.edate == undefined)
                return;

            let ThisPostedDate = this.GetDates(this.THIS_POSTED_DATE);
            let FromDate = this.GetDates(this.record.searchQuery.sdate);
            let ToDate = this.GetDates(this.record.searchQuery.edate);


            if (ThisPostedDate < FromDate) {
                this.nOPDR += this.old_debit;
                this.nOPCR += this.old_credit;
            }
            else if (ThisPostedDate >= FromDate && ThisPostedDate <= ToDate) {
                this.nDR += this.old_debit;
                this.nCR += this.old_credit;
            }
            this.ShowBalance();
        }
    }

    GetDates(_refDate: string) {

        var tempdt = _refDate.split('-');
        let dtyr: number = +tempdt[0];
        let dtmn: number = +tempdt[1];
        let dtdy: number = + (tempdt[2].length > 2 ? tempdt[2].substring(0, 2) : tempdt[2]);
        let sDate = new Date(dtyr, dtmn - 1, dtdy);

        return sDate;
    }

    RecordsExist() {
        if (this.record.records.length > 0)
            return true;
        else
            return false;
    }

    List(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/BankReconciled/List', SearchData, this.gs.headerparam2('authorized'));
    }

    GetPassbookBalance(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/BankReconciled/GetPassbookBalance', SearchData, this.gs.headerparam2('authorized'));
    }

    SaveReconDate(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/BankReconciled/SaveReconDate', SearchData, this.gs.headerparam2('authorized'));
    }

}
