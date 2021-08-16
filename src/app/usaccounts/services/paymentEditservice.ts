import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { GlobalService } from '../../core/services/global.service';
import { Tbl_Acc_Payment, AccPaymentModel } from '../models/Tbl_Acc_Payment';
import { SearchQuery } from '../models/Tbl_Acc_Payment';
import { PageQuery } from '../../shared/models/pageQuery';

import { Tbl_cargo_invoicem } from '../models/Tbl_cargo_Invoicem';

@Injectable({
    providedIn: 'root'
})
export class PaymentEditService {

    public pendingList: Tbl_cargo_invoicem[] = [];
    Old_List: Tbl_cargo_invoicem[] = [];

    public tab: string = 'main';
    public pkid: string;
    public menuid: string;
    public mode: string = '';
    public errorMessage: string;

    public custType = 'MASTER';
    
    public sortcol: string = 'inv_no';
    public sortorder: boolean = true;

    public title: string;
    
    public isAdmin: boolean;

    public IsRefresh = "";

    public IsMultiCurrency = "N";

    public txt_Bal_AR = 0;
    public txt_Bal_AP = 0;
    public txt_Bal_diff = 0;

    public txt_tot_AR = 0;
    public txt_tot_AP = 0;
    public txt_tot_diff = 0;

    public txt_diff = 0;

    public LBL_COUNT = 0;
    public LBL_STATUS = '';

    public Pay_RP = "";

    public decplace = 0;

    public group = 'customer';
    public cust_id = "";
    public cust_code = "";
    public cust_name = "";
    public refno = '';
    public invno = '';
    public custrefno = '';
    public curr_code = '';
    public str_id = "";
    public Search_Mode = "";
    public showall: boolean = false;
    public Customer_ID = '';

    public initlialized: boolean;
    private appid = ''

    selectedId : string;

    constructor(
        private http2: HttpClient,
        private gs: GlobalService
    ) { }

    public selectRowId( id : string){
        this.selectedId = id;
    }
    public getRowId(){
        return this.selectedId;
    }

    
    setup() {
        this.decplace = this.gs.foreign_amt_dec;
        if (!this.gs.IS_SINGLE_CURRENCY) {
            this.curr_code = this.gs.base_cur_code;
        }
        this.isAdmin = this.gs.IsAdmin(this.menuid);
        this.title = this.gs.getTitle(this.menuid);
        this.errorMessage = '';
    }

    init() {

        if ( this.mode == "ADD") {
            this.cust_id = "";
            this.cust_code = "";
            this.cust_name = "";
            this.refno = '';
            this.invno = '';
            this.custrefno = '';        

            this.Customer_ID   = '';
            this.Search_Mode = '';
            this.str_id ='';

            this.selectedId = '';

        }

        this.Pay_RP = "";
        this.txt_Bal_AP = 0;
        this.txt_Bal_AR = 0;
        this.txt_Bal_diff = 0;

        this.txt_tot_AP = 0;
        this.txt_tot_AR = 0;
        this.txt_tot_diff = 0;

        this.txt_diff = 0;

        this.LBL_COUNT = 0;
        this.LBL_STATUS = '';
    }
        

    RefreshList() {
        this.IsRefresh = "YES";
        this.Old_List = this.pendingList.filter(rec => rec.inv_flag === 'Y' && rec.inv_pay_amt > 0);
        this.FindInvoice();
    }

    FindInvoice() {
        /*
        if (this.gs.isBlank(this.cust_id)) {
            alert("No Customer/Parent Selected");
            return;
        }
        */
        if (this.gs.IS_SINGLE_CURRENCY == false) {
            if (this.gs.isBlank(this.curr_code.length)) {
                alert("Currency Code Has to be entered");
                return;
            }
        }

        var SearchData = this.gs.UserInfo;

        // str_id is search string it can be customer id or master or invno or refno

        SearchData.pkid = this.pkid;
        if (!this.gs.isBlank(this.cust_id)) {
            this.Customer_ID = this.cust_id;
            this.str_id = this.cust_id;
            this.Search_Mode = (this.custType == "MASTER") ? "CUSTOMER" : "GROUP";
        }
        else if (!this.gs.isBlank(this.refno)) {
            this.str_id = this.refno;
            this.Search_Mode = "MASTER";
        }
        else if (!this.gs.isBlank(this.invno)) {
            this.str_id = this.invno;
            this.Search_Mode = "INVNO";
        }
        else if (!this.gs.isBlank(this.custrefno)) {
            this.str_id = this.custrefno;
            this.Search_Mode = "REFNO";
        }
        if (this.gs.isBlank(this.Search_Mode)) {
            alert("Search Data Not Found");
            return;
        }
        SearchData.PKID = this.str_id;
        SearchData.MODE = this.Search_Mode;
        SearchData.SHOWALL = (this.showall) ? "Y" : "N";
        if (this.gs.IS_SINGLE_CURRENCY == true) {
            SearchData.CURRENCY = "";
            SearchData.ISBASECURRENCY = "Y";
        }
        else {
            SearchData.CURRENCY = this.curr_code;
            if (this.curr_code == this.gs.base_cur_code)
                SearchData.ISBASECURRENCY = "Y";
            else
                SearchData.ISBASECURRENCY = "N";
        }
        SearchData.HIDE_PAYROLL = this.gs.user_hide_payroll;

        this.PendingList(SearchData).subscribe(
            res => {

                if (this.Search_Mode == "INVNO" || this.Search_Mode == "REFNO" || this.Search_Mode == "MASTER") {
                    if (res.partyname != '')
                        this.cust_name = res.partyname;
                }
                this.pendingList = res.list;

                if (this.IsRefresh == "YES")
                    this.ReProcessInvoiceList();

                this.IsRefresh = "";

                this.FindPartyBalance();

                this.FindTotal();

            },
            err => {
                this.errorMessage = this.gs.getError(err);
                alert(this.errorMessage);
            });
    }

    ReProcessInvoiceList() {
        let iCount = 0;
        this.Old_List.forEach(mRec => {
            this.pendingList.forEach(dRec => {
                if (mRec.inv_pkid == dRec.inv_pkid) {
                    dRec.inv_flag = mRec.inv_flag;
                    dRec.inv_flag2 = mRec.inv_flag2;
                    dRec.inv_pay_amt = mRec.inv_pay_amt;
                    iCount++;
                }
            });
        });
        this.LBL_COUNT = iCount;
    }


    FindTotal(sType: string = '', Rec: Tbl_cargo_invoicem = null) {
        var nAR = 0;
        var nAP = 0;
        var nDiff = 0;
        var nPayAmt = 0;

        var iCount = 0;


        if (sType == "CHKBOX") {
            if (Rec != null) {
                if (Rec.inv_ar_total <= 0 && Rec.inv_ap_total <= 0) {
                    Rec.inv_flag = "N";
                    Rec.inv_flag2 = false;
                    return;
                }
                if (Rec.inv_flag == "Y")
                    Rec.inv_pay_amt = Rec.inv_balance;
                else
                    Rec.inv_pay_amt = null;
            }
        }

        if (Rec != null) {
            nAR = Rec.inv_ar_total;
            nAP = Rec.inv_ap_total;
            nPayAmt = Rec.inv_pay_amt;
            if (nAR > 0)
                nDiff = nAR;
            if (nAP > 0)
                nDiff = nAP;
            nAR = 0;
            nAP = 0;
            nDiff = 0;
        }

        if (this.pendingList) {
            this.pendingList.forEach(mRec => {
                if (mRec.inv_flag == "Y") {
                    iCount++;
                    if (mRec.inv_ar_total > 0) {
                        nAR += mRec.inv_pay_amt;
                        nAR = this.gs.roundNumber(nAR, 2);
                    }
                    else {
                        nAP += mRec.inv_pay_amt;
                        nAP = this.gs.roundNumber(nAP, 2);
                    }
                }
                else {
                    mRec.inv_pay_amt = null;
                }
            });
        }

        nDiff = nAR - nAP;

        nDiff = this.gs.roundNumber(nDiff, 2);

        this.txt_tot_AR = nAR;
        this.txt_tot_AP = nAP;
        this.txt_tot_diff = nDiff;

        this.LBL_COUNT = iCount;

        this.LBL_STATUS = "";
        this.Pay_RP = "";
        if (nDiff > 0) {
            this.Pay_RP = "RECEIPT";
            this.LBL_STATUS = "RECEIPT " +  nDiff.toString();
        }
        else if (nDiff < 0) {
            this.Pay_RP = "PAYMENT";
            this.LBL_STATUS = "PAYMENT " + Math.abs(nDiff).toString();
        }


        var nBal2 = this.txt_Bal_diff;
        nDiff = nBal2 - nDiff;
        nDiff = this.gs.roundNumber(nDiff, 2);
        this.txt_diff = nDiff;

    }



    FindPartyBalance() {
        let nAR = 0;
        let nAP = 0;
        let nDiff = 0;
        nAR = 0;
        nAP = 0;
        nDiff = 0;

        if (this.pendingList) {
            this.pendingList.forEach(mRec => {
                nAR += mRec.inv_ar_total;
                nAP += mRec.inv_ap_total;
                nAR = this.gs.roundNumber(nAR, 2);
                nAP = this.gs.roundNumber(nAP, 2);
            });
        }

        nDiff = nAR - nAP;
        nDiff = this.gs.roundNumber(nDiff, 2);
        this.txt_Bal_AR = nAR;
        this.txt_Bal_AP = nAP;
        this.txt_Bal_diff = nDiff;
        this.txt_diff = nDiff;
    }


    ResetGrid() {
        let nAR = 0;
        let nAP = 0;
        let nPayAmt = 0;

        this.pendingList.forEach(Rec => {

            if (Rec.inv_flag == "Y") {
                nPayAmt = Rec.inv_pay_amt;
                if (Rec.inv_ar_total > 0) {
                    nAR = Rec.inv_ar_total;
                    nAR = nAR - nPayAmt;
                    nAR = this.gs.roundNumber(nAR, 2);
                    Rec.inv_balance = Math.abs(nAR);
                    if (nAR == 0)
                        Rec.inv_ar_total = null;
                    else if (nAR > 0)
                        Rec.inv_ar_total = nAR;
                    else {
                        Rec.inv_ar_total = null;
                        Rec.inv_ap_total = Math.abs(nAR);
                    }
                }
                else {
                    nAP = Rec.inv_ap_total;
                    nAP = nAP - nPayAmt;
                    nAP = this.gs.roundNumber(nAP, 2);
                    Rec.inv_balance = Math.abs(nAP);
                    if (nAP == 0)
                        Rec.inv_ap_total = null;
                    else if (nAP > 0)
                        Rec.inv_ap_total = nAP;
                    else {
                        Rec.inv_ap_total = null;
                        Rec.inv_ar_total = Math.abs(nAP);
                    }
                }
                Rec.inv_pay_amt = null;
                Rec.inv_flag = "N";
                Rec.inv_flag2 = false;

            }
        });

        this.txt_tot_AR = 0;
        this.txt_tot_AP = 0;
        this.txt_tot_diff = 0;
        this.LBL_STATUS = '';
    }





    getSortCol() {
        return this.sortcol;
    }
    getSortOrder() {
        return this.sortorder;
    }

    getIcon(col: string) {
        if (col == this.sortcol) {
            if (this.sortorder)
                return 'fa fa-arrow-down';
            else
                return 'fa fa-arrow-up';
        }
        else
            return null;
    }

    sort(col: string) {
        if (col == this.sortcol) {
            this.sortorder = !this.sortorder;
        }
        else {
            this.sortcol = col;
            this.sortorder = true;
        }
    }



    PendingList(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Payment/PendingList', SearchData, this.gs.headerparam2('authorized'));
    }

    InvoiceList(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + "/api/UsAccRptArApList/PayReqArApList", SearchData, this.gs.headerparam2('authorized'));
    }



}
