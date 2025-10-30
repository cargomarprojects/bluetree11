import { Component, Input, Output, EventEmitter, OnInit, ViewChild, ViewChildren, ElementRef, QueryList } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { InputBoxComponent } from '../../shared/input/inputbox.component';
import { GlobalService } from '../../core/services/global.service';
import { SearchTable } from '../../shared/models/searchtable';
import { Tbl_Invoice_Riderm, Tbl_Invoice_Riderd, vm_Tbl_Invoice_Riderm } from '../models/Tbl_Invoice_Rider';
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
    @Input() public inv_mbl_id: string = '';
    @Input() public menuid: string = '';
    @Output() callbackevent = new EventEmitter<any>();

    @ViewChild('_irm_cntr_no') irm_cntr_no_field: ElementRef;
    @ViewChildren('_ird_rate') ird_rate_field: QueryList<ElementRef>;

    public record: Tbl_Invoice_Riderm = <Tbl_Invoice_Riderm>{};
    public records: Tbl_Invoice_Riderm[] = [];
    public detrecords: Tbl_Invoice_Riderd[] = [];
    public ContainerList: Tbl_Invoice_Riderm[];
    pkid: string;
    mode: string;
    title: string = '';
    isAdmin: boolean;
    errorMessage: string;
    is_CntrExist: boolean = true;
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
        this.title = 'D&D INFO';
        this.isAdmin = this.gs.IsAdmin(this.menuid);
        this.errorMessage = '';
        this.LoadCombo();
        this.List('LOAD');
    }

    LoadCombo() {
        let SearchData = {
            mbl_id: this.inv_mbl_id
        };
        this.mainService.LoadMblContainer(SearchData)
            .subscribe(response => {
                this.ContainerList = response.list;

                this.is_CntrExist = false;
                if (!this.gs.isBlank(this.ContainerList)) {
                    this.ContainerList.forEach(a => {
                        if (this.gs.isBlank(this.record.irm_cntr_no))
                            this.record.irm_cntr_no = a.irm_cntr_no;
                    })

                    if (this.ContainerList.length > 0)
                        this.is_CntrExist = true;
                    if (!this.gs.isBlank(this.irm_cntr_no_field))
                        this.irm_cntr_no_field.nativeElement.focus();
                }

            }, error => {
                this.errorMessage = error.message;
                alert(this.errorMessage);
            });
    }


    NewRecord() {
        this.mode = 'ADD'
        this.actionHandler();
    }

    EditRecord(_rec: Tbl_Invoice_Riderm) {
        this.mode = 'EDIT'
        this.pkid = _rec.irm_pkid;
        this.actionHandler();
    }

    actionHandler() {
        this.errorMessage = '';
        if (this.mode == 'ADD') {
            this.record = <Tbl_Invoice_Riderm>{};
            this.detrecords = <Tbl_Invoice_Riderd[]>[];
            this.pkid = this.gs.getGuid();
            this.init();
        }
        if (this.mode == 'EDIT') {
            this.GetRecord();
        }
    }

    init() {
        this.record.irm_pkid = this.pkid;
        this.record.irm_inv_id = this.inv_pkid;
        this.record.irm_cntr_no = '';
        this.record.irm_inv_due_dt = 'INVOICE DATE';
        this.record.irm_allowed_free_days = 0;
        this.record.irm_allowed_days_type = 'WORKING DAYS';
        this.record.irm_cntr_avlb_dt = ''
        this.record.irm_free_dt_start = '';
        this.record.irm_free_dt_end = '';
        this.record.irm_dnd_rule = '';
        this.record.irm_charged_dt_from = '';
        this.record.irm_charged_dt_to = '';
        this.record.irm_tot_amt = 0;
        if (!this.gs.isBlank(this.ContainerList)) {
            this.ContainerList.forEach(a => {
                if (this.gs.isBlank(this.record.irm_cntr_no))
                    this.record.irm_cntr_no = a.irm_cntr_no;
            })
        }
        if (!this.gs.isBlank(this.irm_cntr_no_field))
            this.irm_cntr_no_field.nativeElement.focus();
    }

    GetRecord() {
        this.errorMessage = '';
        var SearchData = this.gs.UserInfo;
        SearchData.pkid = this.pkid;
        this.mainService.GetRecord(SearchData)
            .subscribe(response => {
                this.record = <Tbl_Invoice_Riderm>response.record;
                this.detrecords = <Tbl_Invoice_Riderd[]>response.detrecords;
                this.mode = 'EDIT';
                if (!this.gs.isBlank(this.irm_cntr_no_field))
                    this.irm_cntr_no_field.nativeElement.focus();
            }, error => {
                this.errorMessage = this.gs.getError(error);
                alert(this.errorMessage);
            });
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
        this.FindGrandTotal();
        if (!this.Allvalid())
            return;
        if (!confirm("Save")) {
            return;
        }
        this.record.irm_inv_id = this.inv_pkid;
        const saveRecord = <vm_Tbl_Invoice_Riderm>{};
        saveRecord.userinfo = this.gs.UserInfo;
        saveRecord.record = this.record;
        saveRecord.detrecords = this.detrecords;
        saveRecord.mode = this.mode;

        this.mainService.Save(saveRecord)
            .subscribe(response => {
                if (response.retvalue == false) {
                    this.errorMessage = response.error;
                    alert(this.errorMessage);
                }
                else {
                    this.RefreshList();
                    // this.errorMessage = 'Save Complete';
                    // alert(this.errorMessage);
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

        let iCtr = 0;
        this.detrecords.forEach(Rec => {
            iCtr++;
            Rec.ird_slno = iCtr;

            if (this.gs.isZero(Rec.ird_qty)) {
                bRet = false;
                this.errorMessage = "Invalid Qty";
                alert(this.errorMessage);
                return bRet;
            }
            if (this.gs.isZero(Rec.ird_rate)) {
                bRet = false;
                this.errorMessage = "Invalid Rate";
                alert(this.errorMessage);
                return bRet;
            }

            if (this.gs.isZero(Rec.ird_amt)) {
                bRet = false;
                this.errorMessage = "Invalid Amount";
                alert(this.errorMessage);
                return bRet;
            }
        });

        if (iCtr == 0) {
            bRet = false;
            this.errorMessage = "No Detail Rows To Save";
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
            REC.irm_allowed_days_type = this.record.irm_allowed_days_type;
            REC.irm_free_dt_start = this.record.irm_free_dt_start;
            REC.irm_free_dt_end = this.record.irm_free_dt_end;
            REC.irm_dnd_rule = this.record.irm_dnd_rule;
            REC.irm_charged_dt_from = this.record.irm_charged_dt_from;
            REC.irm_charged_dt_to = this.record.irm_charged_dt_to;
            REC.irm_tot_amt = this.record.irm_tot_amt;
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
    OnBlur(field: string, rec: Tbl_Invoice_Riderd = null) {
        switch (field) {
            case 'ird_rate': {
                rec.ird_rate = this.gs.roundNumber(rec.ird_rate, 2);
                this.findRowTotal(rec);
                break;
            }
            case 'ird_qty': {
                rec.ird_qty = this.gs.roundNumber(rec.ird_qty, 3);
                this.findRowTotal(rec);
                break;
            }
        }
    }

    CloseModal() {
        if (this.callbackevent != null) {
            let data = {
                action: 'CLOSE',
                pkid: this.inv_pkid
            }
            this.callbackevent.emit(data);
        }
    }

    AddDetRow() {

        var rec = <Tbl_Invoice_Riderd>{};
        rec.ird_pkid = this.gs.getGuid();
        rec.ird_parent_id = this.pkid;
        rec.ird_slno = this.detrecords.length + 1;
        rec.ird_rate = 0;
        rec.ird_qty = 1;
        rec.ird_amt = 0;
        this.detrecords.push(rec);

        this.ird_rate_field.changes
            .subscribe((queryChanges) => {
                this.ird_rate_field.last.nativeElement.focus();
            });
    }

    removeDetRow(_rec: Tbl_Invoice_Riderd) {

        if (!confirm('Remove Line Item Y/N'))
            return;
        this.detrecords.forEach((rec, index) => {
            if (rec == _rec) {
                this.detrecords.splice(index, 1);
            }
        });
        this.FindGrandTotal();
    }

    findRowTotal(rec: Tbl_Invoice_Riderd) {

        let nQty = rec.ird_qty;
        let nRate = rec.ird_rate;
        let nAmt = rec.ird_amt;
        nQty = rec.ird_qty;
        if (nQty == 0) {
            nQty = 1;
        }
        nRate = rec.ird_rate;
        if (!this.gs.isZero(nRate)) {
            nAmt = nQty * nRate;
            nAmt = this.gs.fixDecimalDigits(nAmt, 3);
            nAmt = this.gs.roundNumber(nAmt, 2);
            rec.ird_amt = nAmt;
        }

        this.FindGrandTotal();
    }

    FindGrandTotal() {
        let nTot = 0;
        let iCtr = 0;
        this.detrecords.forEach(Rec => {
            iCtr++;
            Rec.ird_slno = iCtr;
            nTot += Rec.ird_amt;
        });

        nTot = this.gs.roundNumber(nTot, 2);
        this.record.irm_tot_amt = nTot;
    }
}