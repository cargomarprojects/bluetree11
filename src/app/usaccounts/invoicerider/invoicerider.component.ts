import { Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { InputBoxComponent } from '../../shared/input/inputbox.component';
import { GlobalService } from '../../core/services/global.service';
import { SearchTable } from '../../shared/models/searchtable';
import { Tbl_Invoice_Riderm, vm_Tbl_Invoice_Riderm } from '../models/Tbl_Invoice_Rider';
import { InvoiceRiderService } from '../services/invoicerider.service';
import { DateComponent } from '../../shared/date/date.component';

@Component({
    selector: 'app-invoicerider',
    templateUrl: './invoicerider.component.html',
})
export class InvoiceRiderComponent implements OnInit {
    // Local Variables 

    @Input() public inv_ref_no: string = '';
    @Input() public inv_pkid: string = '';
    @Input() public inv_no: string = '';
    @Input() public menuid: string = '';

    @ViewChild('irm_cntr_no') irm_cntr_no_field: ElementRef;
    //   @ViewChild('payment_date') payment_date_field: DateComponent;

    record: Tbl_Invoice_Riderm = <Tbl_Invoice_Riderm>{};
    records: Tbl_Invoice_Riderm[] = [];

    pkid: string;
    mode: string;
    title: string = '';
    isAdmin: boolean;
    errorMessage: string;
    //is_locked: boolean = false;
    //origin: string;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private location: Location,
        public gs: GlobalService,
        private mainService: InvoiceRiderService
    ) { }

    ngOnInit() {
        this.gs.checkAppVersion();
        this.mode = 'ADD';
        this.initPage();
        this.actionHandler();
    }

    private initPage() {
        this.title = 'Invoice Rider';
        this.isAdmin = this.gs.IsAdmin(this.menuid);
        this.errorMessage = '';
        this.LoadCombo();
        this.List('LOAD');
    }

    LoadCombo() {

    }


    NewRecord() {
        this.mode = 'ADD'
        this.actionHandler();
    }

    EditRecord(_rec: Tbl_Invoice_Riderm) {
        this.mode = 'EDIT'
        this.pkid = _rec.irm_pkid;
        // this.payrecord.cp_pkid = this.pkid;
        // this.payrecord.cp_master_id = this.cp_master_id;
        // this.payrecord.cp_source = this.cp_source;
        // this.payrecord.cp_mode = this.cp_mode;
        // this.payrecord.cp_pay_status = _rec.cp_pay_status;
        // this.payrecord.cp_paytype_needed = _rec.cp_paytype_needed;
        // this.payrecord.cp_spl_notes = _rec.cp_spl_notes;
        // this.payrecord.cp_payment_date = _rec.cp_payment_date;
        // this.payrecord.cp_cust_name = _rec.cp_cust_name;
        // this.payrecord.cp_cust_id = _rec.cp_cust_id;
        // this.payrecord.cp_inv_no = _rec.cp_inv_no
        // this.payrecord.cp_inv_id = _rec.cp_inv_id;
        // this.invrecords.forEach(Rec => {
        //   if (_rec.cp_inv_no == Rec.cp_inv_no)
        //     Rec.cp_selected = true;
        //   else
        //     Rec.cp_selected = false;
        // })
        // if (!this.gs.isBlank(this.paytype_needed_field))
        //   this.paytype_needed_field.nativeElement.focus();
    }

    actionHandler() {
        this.errorMessage = '';
        if (this.mode == 'ADD') {
            this.record = <Tbl_Invoice_Riderm>{};
            this.pkid = this.gs.getGuid();
            this.init();
        }
    }

    init() {
        this.record.irm_pkid = this.pkid;
        this.record.irm_cntr_no = '';

        // // this.payrecord.cp_paytype_needed = 'PAYMENT NEEDED ONLY';
        // this.payrecord.cp_paytype_needed = '';
        // this.payrecord.cp_spl_notes = '';
        // this.payrecord.cp_payment_date = '';
        // this.payrecord.cp_cust_name = '';
        // this.payrecord.cp_cust_id = '';
        // this.payrecord.cp_inv_no = '';
        // this.payrecord.cp_inv_id = '';
        // this.invrecords.forEach(Rec => {
        //   Rec.cp_selected = false;
        // })
        // if (!this.gs.isBlank(this.paytype_needed_field))
        //   this.paytype_needed_field.nativeElement.focus();
    }


    List(_type: string) {

        this.errorMessage = '';
        var SearchData = this.gs.UserInfo;
        SearchData.pkid = this.inv_pkid;
        this.mainService.List(SearchData)
            .subscribe(response => {
                this.records = (response.records == undefined || response.records == null) ? <Tbl_Invoice_Riderm[]>[] : <Tbl_Invoice_Riderm[]>response.records;
                if (!this.gs.isBlank(this.irm_cntr_no_field))
                    this.irm_cntr_no_field.nativeElement.focus();
            },
                error => {
                    this.errorMessage = this.gs.getError(error);
                    alert(this.errorMessage);
                });
    }


    LovSelected(_Record: SearchTable) {
        // if (_Record.controlname == "PAYEE") {
        //   this.payrecord.cp_cust_id = _Record.id;
        //   this.payrecord.cp_cust_name = _Record.name;
        //   this.payment_date_field.Focus();
        // }
    }

    Save() {

        if (!this.Allvalid())
            return;
        if (!confirm("Save")) {
            return;
        }
        this.record.irm_inv_id = this.inv_pkid;
        const saveRecord = <vm_Tbl_Invoice_Riderm>{};
        saveRecord.userinfo = this.gs.UserInfo;
        saveRecord.record = this.record;
        saveRecord.mode = this.mode;

        this.mainService.Save(saveRecord)
            .subscribe(response => {
                if (response.retvalue == false) {
                    this.errorMessage = response.error;
                    alert(this.errorMessage);
                }
                else {
                    this.RefreshList();
                    this.errorMessage = 'Save Complete';
                    alert(this.errorMessage);
                    this.NewRecord();
                }
            }, error => {
                this.errorMessage = this.gs.getError(error);
                alert(this.errorMessage);
            });
    }

    private Allvalid(): boolean {

        var bRet = true;
        this.errorMessage = "";

        if (this.inv_pkid == "") {
            bRet = false;
            this.errorMessage = "Invalid ID";
            alert(this.errorMessage);
            return bRet;
        }

        if (this.gs.isBlank(this.record.irm_cntr_no)) {
            bRet = false;
            this.errorMessage = "Container Number cannot be blank";
            alert(this.errorMessage);
            return bRet;
        }
        return bRet;
    }


    Close() {
        this.location.back();
    }

    RefreshList() {
        if (this.records == null)
            return;
        var REC = this.records.find(rec => rec.irm_pkid == this.record.irm_pkid);
        if (REC == null) {
            this.record.rec_created_by = this.gs.user_code;
            this.record.rec_created_date = this.gs.defaultValues.today;
            this.records.push(this.record);
        }
        else {
            REC.irm_cntr_no = this.record.irm_cntr_no;
            REC.irm_allowed_free_days = this.record.irm_allowed_free_days;
            // REC.cp_payment_date = this.payrecord.cp_payment_date;
            // REC.cp_pay_status = this.payrecord.cp_pay_status;
            // REC.cp_spl_notes = this.payrecord.cp_spl_notes;
            // REC.cp_cust_id = this.payrecord.cp_cust_id;
            // REC.cp_cust_code = this.payrecord.cp_cust_code;
            // REC.cp_cust_name = this.payrecord.cp_cust_name;
        }
    }

    RemoveRow(_rec: Tbl_Invoice_Riderm) {
        this.errorMessage = '';
        if (!confirm("DELETE RECORD, " + _rec.irm_cntr_no)) {
            return;
        }

        var SearchData = this.gs.UserInfo;
        SearchData.pkid = _rec.irm_pkid;
        this.mainService.DeleteRecord(SearchData)
            .subscribe(response => {
                if (response.retvalue == false) {
                    this.errorMessage = response.error;
                    alert(this.errorMessage);
                }
                else {
                    this.records.splice(this.records.findIndex(rec => rec.irm_pkid == _rec.irm_pkid), 1);
                    this.NewRecord();
                }
            }, error => {
                this.errorMessage = this.gs.getError(error);
            });
    }

    OnChange(field: string) {

        if (field == 'cp_selected') {

        }
    }

}