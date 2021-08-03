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
export class DepositEditService {

    record: Tbl_Acc_Payment = <Tbl_Acc_Payment>{};

    tab: string = 'main';

    pkid: string;
    menuid: string;
    public mode: string = '';
    errorMessage: string;
    Foregroundcolor: string;

    total_amount = 0;
    iTotChq = 0;

    docno = '';
    sdate = '';
    id = '';
    code = '';
    name = '';
    remarks = '';

    next_chqno = 0;

    CFNO = "";

    title: string;
    isAdmin: boolean;
    refno: string = "";

    decplace = 0;

    isAccLocked = false;

    showchqdt = true;

    where = " ACC_IS_PAYMENT_CODE = 'Y' AND ACC_BRANCH IN ('ALL','" + this.gs.branch_code + "')";
    

    oldrefno = '';

    arPendingList: Tbl_Acc_Payment[] = [];
    DetailList: Tbl_Acc_Payment[] = [];


    public initlialized: boolean;
    private appid = ''

    constructor(
        private http2: HttpClient,
        private gs: GlobalService
    ) { }


    setup() {

        if (this.gs.SHOW_CHECK_DATE == "N") {
            this.showchqdt = false;
        }

    }
    initPage() {
        this.isAdmin = this.gs.IsAdmin(this.menuid);
        this.title = this.gs.getTitle(this.menuid);
        this.errorMessage = '';

    }
      

    SaveParent() {

        this.record = <Tbl_Acc_Payment>{};
        this.record.pay_pkid = this.pkid;
        this.record.pay_cust_id = "";
        this.record.pay_acc_id = this.id;
        this.record.pay_date = this.sdate;
        this.record.pay_narration = this.remarks;
        this.record.pay_type = "DEPOSIT";
        this.record.pay_year = +this.gs.year_code;
        this.record.pay_total = this.total_amount;
        this.record.pay_status = "POSTED";
        this.record.pay_posted = "Y";
        this.record.pay_memo = "";
        this.record.pay_tot_chq = this.iTotChq;

    }


    Allvalid(): boolean {

        var bRet = true;
        this.errorMessage = "";

        if (this.gs.isBlank(this.sdate)) {
            bRet = false;
            this.errorMessage = "Invalid Date";
            alert(this.errorMessage);
            return bRet;
        }


        if (this.gs.isBlank(this.id) || this.gs.isBlank(this.code) || this.gs.isBlank(this.name)) {
            bRet = false;
            this.errorMessage = "Invalid Bank";
            alert(this.errorMessage);
            return bRet;
        }


        if (this.gs.isZero(this.total_amount)) {
            bRet = false;
            this.errorMessage = "No Rows Selected";
            alert(this.errorMessage);
            return bRet;
        }



        var iCtr = 0;
        this.arPendingList.forEach(Record => {
            if (Record.pay_flag2) {
                iCtr++;
            }
        });
        if (iCtr == 0) {
            alert("No Detail Rows To Save")
            return;
        }

        var nAmt = 0;
        this.iTotChq = 0;

        this.DetailList = <Tbl_Acc_Payment[]>[];

        this.arPendingList.forEach(Record => {

            if (Record.pay_flag2 && Record.pay_total > 0) {
                var DetailRow = <Tbl_Acc_Payment>{};
                DetailRow.pay_pkid = Record.pay_pkid;
                DetailRow.pay_total = Record.pay_total;
                nAmt += Record.pay_total;
                nAmt = this.gs.roundNumber(nAmt, 2);
                this.iTotChq++;
                this.DetailList.push(DetailRow);
            }
        });

        if (nAmt != this.total_amount) {
            alert("Difference in Total Amount And selected Amount");
            return false;
        }
        return bRet;
    }




    DepositPendingList(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Deposit/DepositPendingList', SearchData, this.gs.headerparam2('authorized'));
    }
    Save(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Deposit/Save', SearchData, this.gs.headerparam2('authorized'));
    }
}
