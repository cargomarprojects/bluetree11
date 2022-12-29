import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from '../../core/services/global.service';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Tbl_Acc_Payment } from '../models/Tbl_Acc_Payment';
import { PaymentService } from '../services/payment.service';
import { SearchTable } from '../../shared/models/searchtable';
// declare var $: any;

@Component({
    selector: 'app-payment-bank-update',
    templateUrl: './payment-bank-update.component.html'
})
export class PaymentBankUpdateComponent implements OnInit {

    public errorMessage: string = '';
    public tab: string = 'main';


    @Input() record: Tbl_Acc_Payment;
    @Output() callbackevent = new EventEmitter<any>();

    modal: any;

    Txt_ChqNo: string = '';
    sdate = "";
    where = " ACC_IS_PAYMENT_CODE = 'Y' AND ACC_BRANCH IN ('ALL','" + this.gs.branch_code + "')";
    Txt_Bank_Id = '';
    Txt_Bank_Code = '';
    Txt_Bank_Name = '';

    constructor(
        private modalconfig: NgbModalConfig,
        private modalservice: NgbModal,
        private http2: HttpClient,
        private mainservice: PaymentService,
        public gs: GlobalService) {
        modalconfig.backdrop = 'static'; //true/false/static
        modalconfig.keyboard = true; //true Closes the modal when escape key is pressed
    }

    ngOnInit() {
        this.gs.checkAppVersion();
        // $(function () {
        //     $('.modal-dialog').draggable();
        // });
    }

    onBlur(field: string) {

    }


    Showmodal(paymodal: any = null) {
        this.Txt_Bank_Id = this.record.pay_acc_id;
        this.Txt_Bank_Code = this.record.pay_acc_code;
        this.Txt_Bank_Name = this.record.pay_acc_name;
        this.modal = this.modalservice.open(paymodal, {  windowClass : "myCustomModalClass",centered: true });
    }


    Save() {

        if (this.gs.isBlank(this.Txt_Bank_Id) || this.gs.isBlank(this.Txt_Bank_Code)) {
            alert("Invalid Bank");
            return false;
        }


        var searchData = this.gs.UserInfo;
        searchData.TYPE = "PAY_BANK";
        searchData.PAY_PKID = this.record.pay_pkid;
        searchData.PAY_BANK_OLD_ID = this.record.pay_acc_id;
        searchData.PAY_BANK_ID = this.Txt_Bank_Id;
        searchData.company_code = this.gs.company_code;
        searchData.branch_code = this.gs.branch_code;

        this.mainservice.PaymentUpdate(searchData)
            .subscribe(response => {
                if (response.retvalue) {
                    this.record.pay_acc_id = this.Txt_Bank_Id;
                    this.record.pay_acc_code = this.Txt_Bank_Code;
                    this.record.pay_acc_name = this.Txt_Bank_Name;
                    this.modal.close();
                }
            }, error => {
                alert(this.gs.getError(error));
            });

    }


    Close() {

        // if (this.callbackevent)
        //     this.callbackevent.emit({ action: 'CLOSE', rec: this.record });
        this.modal.close();
    }

    LovSelected(_Record: SearchTable) {
        if (_Record.controlname == "ACCTM") {
            this.Txt_Bank_Id = _Record.id;
            this.Txt_Bank_Code = _Record.code;
            this.Txt_Bank_Name = _Record.name;
        }
    }

}
