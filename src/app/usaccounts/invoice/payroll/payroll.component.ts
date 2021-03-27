import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from '../../../core/services/global.service';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Tbl_Cargo_Invoiced } from '../../models/Tbl_cargo_Invoicem';
import { invoiceService } from '../../services/invoice.service';

@Component({
    selector: 'app-payroll',
    templateUrl: './payroll.component.html'
})
export class PayrollComponent implements OnInit {

    public errorMessage: string = '';
    public tab: string = 'main';

    private _mblid: string;
    @Input() set mblid(value: string) {
        this._mblid = value;
    }

    private _custid: string = '';
    @Input() set custid(value: string) {
        this._custid = value;
    }

    private _refno: string;
    @Input() set refno(value: string) {
        this._refno = value;
    }

    private _empname: string;
    @Input() set empname(value: string) {
        this._empname = value;
    }

    @Output() callbackevent = new EventEmitter<any>();

    modal: any;
    public records: Tbl_Cargo_Invoiced[] = [];
    public SelectedRecord: Tbl_Cargo_Invoiced = <Tbl_Cargo_Invoiced>{};


    constructor(
        private modalconfig: NgbModalConfig,
        private modalservice: NgbModal,
        private http2: HttpClient,
        private mainservice: invoiceService,
        private gs: GlobalService) {
        modalconfig.backdrop = 'static'; //true/false/static
        modalconfig.keyboard = true; //true Closes the modal when escape key is pressed
    }

    ngOnInit() {

    }

    PayrollFill(payrollmodal: any = null) {

        if (this.gs.isBlank(this._custid)) {
            alert('Invalid Customer');
            return;
        }
        var SearchData = this.gs.UserInfo;
        SearchData.DCODE = this.gs.PAYROLL_INVOICE_CODE;
        SearchData.ACODE = this.gs.PAYROLL_ACC_CODE;
        SearchData.MBL_ID = this._mblid;
        SearchData.CUST_ID = this._custid;
        this.mainservice.GetPayroll(SearchData).subscribe(response => {
            this.records = response.list;
            this.records.forEach(rec => {
                if (rec.invd_payroll_yn == 'Y')
                    rec.invd_payroll_b = true;
                else
                    rec.invd_payroll_b = false;
            });
            this.modal = this.modalservice.open(payrollmodal, { centered: true });

        }, error => {
            alert(this.gs.getError(error));
        });

    }

    SelectRecord(_rec: Tbl_Cargo_Invoiced) {
        _rec.invd_payroll_yn = 'Y';
        this.SelectedRecord = _rec;

        this.records.forEach(Rec => {
            if (Rec.invd_payroll_date == _rec.invd_payroll_date) {
                Rec.invd_payroll_yn = 'Y';
                Rec.invd_payroll_b = true;
            } else {
                Rec.invd_payroll_yn = 'N';
                Rec.invd_payroll_b = false;
            }
        })
    }
    
    CloseModal(_type:string) {

        if (this.callbackevent)
            this.callbackevent.emit({ action: _type, rec: this.SelectedRecord });

        this.modal.close();
    }

    
}
