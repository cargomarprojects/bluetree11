import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from '../../core/services/global.service';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Tbl_Acc_Payment } from '../models/Tbl_Acc_Payment';
import { PaymentService } from '../services/payment.service';

// declare var $: any;

@Component({
    selector: 'app-payment-date-update',
    templateUrl: './payment-date-update.component.html',
    styleUrls: ['./payment-date-update.component.css'],
})
export class PaymentDateUpdateComponent implements OnInit {

    public errorMessage: string = '';
    public tab: string = 'main';


    @Input() record: Tbl_Acc_Payment;
    @Output() callbackevent = new EventEmitter<any>();

    modal: any;

    Txt_ChqNo: string = '';

    sdate = "";

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
        this.sdate = this.record.pay_date;
        this.modal = this.modalservice.open(paymodal, {  windowClass : "myCustomModalClass",centered: true });
    }


    Save() {

        if (this.gs.isBlank(this.sdate)) {
            alert("Date Cannot blank");
            return false;
        }

        var searchData = this.gs.UserInfo;
        searchData.TYPE = "PAY_DATE";
        searchData.PAY_PKID = this.record.pay_pkid;
        searchData.PAY_DATE = this.sdate;
        searchData.PAY_DATE_OLD = this.record.pay_date;
        searchData.company_code = this.gs.company_code;
        searchData.branch_code = this.gs.branch_code;

        this.mainservice.PaymentUpdate(searchData)
            .subscribe(response => {
                if (response.retvalue) {
                    this.record.pay_date = this.sdate;
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


}
