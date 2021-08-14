import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { GlobalService } from '../../core/services/global.service';
import { Tbl_Acc_Payment, vm_tbl_accPayment,AccPaymentModel } from '../models/Tbl_Acc_Payment';
import { DepositService } from './deposit.service';


@Injectable({
    providedIn: 'root'
})
export class DepositEditService {

    record: Tbl_Acc_Payment = <Tbl_Acc_Payment>{};
    tab: string = 'main';

    pkid: string;
    menuid: string;
    mode: string = '';
    errorMessage: string;
    Foregroundcolor: string;

    total_amount = 0;
    iTotChq = 0;

    savetype = "";    

    sdate = '';
    id = '';
    code = '';
    name = '';
    remarks = '';

    title: string;
    isAdmin: boolean;

    selectedId = '';

    where = " ACC_IS_PAYMENT_CODE = 'Y' AND ACC_BRANCH IN ('ALL','" + this.gs.branch_code + "')";

    arPendingList: Tbl_Acc_Payment[] = [];
    DetailList: Tbl_Acc_Payment[] = [];

    public initlialized: boolean;
    private appid = ''

    constructor(
        private http2: HttpClient,
        private gs: GlobalService
    ) { }



    public init(params: any) {

        this.menuid = params.menuid;
        this.mode = params.mode;

        if (this.appid != this.gs.appid) {
            this.appid = this.gs.appid;
            this.initlialized = false;
        }
        
        if (this.initlialized)
            return;
        
        this.initlialized = true;

        this.NewRecord();

        this.isAdmin = this.gs.IsAdmin(this.menuid);
        this.title = this.gs.getTitle(this.menuid);
        this.errorMessage = '';

    }

    public selectRowId( id : string){
        this.selectedId = id;
    }
    public getRowId(){
        return this.selectedId;
    }

    

    NewRecord() {
        this.initRecord();
        this.InitBank();
    }

    initRecord(){
        this.record = <Tbl_Acc_Payment>{};
        this.arPendingList = <Tbl_Acc_Payment[]>[];
        this.DetailList = <Tbl_Acc_Payment[]>[];
        this.total_amount = 0;
        this.remarks = '';
        this.errorMessage = '';
    }
    
    InitBank(){
        this.id = '';
        this.code = '';
        this.name = '';
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
        this.record.rec_created_by = this.gs.user_code;
        this.record.rec_created_date = this.gs.defaultValues.today;        
    }

    Save() {
        if (!this.Allvalid())
            return;

        this.pkid = this.gs.getGuid();
        
        this.SaveParent();

        const saveRecord = <vm_tbl_accPayment>{};

        saveRecord.record = this.record;
        saveRecord.records = this.DetailList;

        saveRecord.pkid = this.pkid;
        saveRecord.mode = "ADD";
        saveRecord.savetype =  this.savetype;
        saveRecord.userinfo = this.gs.UserInfo;

        this.SaveRecord(saveRecord)
            .subscribe(response => {
                if (response.retvalue == false) {
                    this.errorMessage = response.error;
                    alert(this.errorMessage);
                }
                else {

                    /*
                    this.record.pay_docno = response.DOCNO;
                    this.record.pay_date = this.sdate;
                    this.record.pay_acc_name = this.name;
                    this.record.pay_diff = this.total_amount;
                    this.record.pay_tot_chq = this.iTotChq;
                    this.record.pay_posted = "Y";
                    this.record.pay_narration = this.remarks;
                    this.msList.RefreshList(this.record);
                    */
                    this.errorMessage = 'Save Complete';
                    
                    alert(this.errorMessage);
                    
                    this.DetailList.forEach(_rec => {
                        this.arPendingList.splice(this.arPendingList.findIndex(rec => rec.pay_pkid == _rec.pay_pkid), 1);
                    });

                    this.errorMessage = '';
                    this.DetailList = <Tbl_Acc_Payment[]>[];
                    this.total_amount = 0;
                }
            }, error => {
                this.errorMessage = this.gs.getError(error);
                alert(this.errorMessage);
            });
    }

    pendingList() {
        this.selectedId = '';
        var SearchData = this.gs.UserInfo;
        SearchData.pkid = this.pkid;
        this.DepositPendingList(SearchData).subscribe(
            res => {
                this.arPendingList = res.list;
            },
            err => {
                this.errorMessage = this.gs.getError(err);
                alert(this.errorMessage);
            });
    }

    DepositPendingList(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Deposit/DepositPendingList', SearchData, this.gs.headerparam2('authorized'));
    }
    SaveRecord(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Deposit/Save', SearchData, this.gs.headerparam2('authorized'));
    }
}
