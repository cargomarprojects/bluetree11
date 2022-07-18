import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from '../../core/services/global.service';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Tbl_cargo_whstock} from '../models/tbl_cargo_whstock';
import { WhStockService } from '../services/whstock.service';
import { SearchTable } from '../../shared/models/searchtable';

@Component({
    selector: 'app-whstock-transfer',
    templateUrl: './whstock-transfer.component.html'
})
export class WhStockTransferComponent implements OnInit {


    private _parent_id: string;
    @Input() set parent_id(value: string) {
        this._parent_id = value;
    }

    private _inm_cust_id: string;
    @Input() set inm_cust_id(value: string) {
        this._inm_cust_id = value;
    }
    private _inm_cust_code: string;
    @Input() set inm_cust_code(value: string) {
        this._inm_cust_code = value;
    }
    private _inm_cust_name: string;
    @Input() set inm_cust_name(value: string) {
        this._inm_cust_name = value;
    }
    @Output() ModifiedRecords = new EventEmitter<any>();

    errorMessage: string;
    menuid: string;
    title: string;

    is_locked: boolean = false;
     
    inm_wh_id: string = '';
    inm_wh_code: string = '';
    inm_wh_name: string = '';
    inm_arrival_date: string = '';

    constructor(
        private location: Location,
        public gs: GlobalService,
        public mainservice: WhStockService
    ) { }

    ngOnInit() {
        this.gs.checkAppVersion();
        this.LoadCompany();
        this.inm_arrival_date = this.gs.defaultValues.today;
    }

     

    LoadCompany() {
         
    }

    LovSelected(_Record: SearchTable) {

        if (_Record.controlname == "WAREHOUSE") {
            this.inm_wh_id = _Record.id;
            this.inm_wh_code = _Record.code;
            this.inm_wh_name = _Record.name;
        }
        if (_Record.controlname == "CUSTOMER") {
            this.inm_cust_id = _Record.id;
            this.inm_cust_code = _Record.code;
            this.inm_cust_name = _Record.name;
            if (_Record.col8 != "")
                this.inm_cust_name = _Record.col8;
        }
    }
     

    // TransferData() {
    //     if (this.gs.isBlank(this.ref_date)) {
    //         alert("Ref Date cannot be blank");
    //         this.ref_date_field.Focus();
    //         return;
    //     }
    //     if (this.gs.isBlank(this.branch_code)) {
    //         alert("Branch cannot be blank");
    //         this.branch_code_field.nativeElement.focus();
    //         return;
    //     }
    //     if (this.gs.isBlank(this.handled_id)) {
    //         alert("A/N Handled By cannot be blank");
    //         this.handled_lov_field.Focus();
    //         return;
    //     }

    //     this.TransferData(true);
    // }

    TransferData() {

        // var SearchData = this.gs.UserInfo;
        // if (this.gs.isBlank(this.mrecord.masterid))
        //     SearchData.MASTERID = '';
        // else
        //     SearchData.MASTERID = this.mrecord.masterid;
        // SearchData.REF_DATE = this.ref_date;
        // SearchData.HANDLED_ID = this.handled_id;
        // SearchData.REC_COMPANY_CODE = this.gs.company_code;
        // SearchData.REC_BRANCH_CODE = this.branch_code;
        // SearchData.DUP_CHK_ONLY = "N";
        // SearchData.CHK_MBL_DUP = chkMblDup == true ? "Y" : "N";
        // this.mainservice.TransferData(SearchData).subscribe(response => {
        //     if (response.retvalue == true) {
        //         if (response.warningmsg.trim().length > 0) {
        //             if (confirm(response.warningmsg)) {
        //                 this.TransferData(false);
        //             }
        //         } else {
        //             if (this.ModifiedRecords != null)
        //                 this.ModifiedRecords.emit({ saction: 'CLOSE' });
        //         }
        //     }

        // }, error => {
        //     this.errorMessage = this.gs.getError(error)
        //     alert(this.errorMessage);
        // });
    }

    Close() {
        if (this.ModifiedRecords != null)
            this.ModifiedRecords.emit({ saction: 'CLOSE' });
    }
 

}
