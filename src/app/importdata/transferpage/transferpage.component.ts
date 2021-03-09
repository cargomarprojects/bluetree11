import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SearchTable } from '../../shared/models/searchtable';
import { GlobalService } from '../../core/services/global.service';
import { Tbl_edi_master, Tbl_edi_house } from '../models/tbl_edi_master';
import { ShipDataPageService } from '../services/shipdatapage.service';
import { DateComponent } from '../../shared/date/date.component';
import { AutoComplete2Component } from '../../shared/autocomplete2/autocomplete2.component';

@Component({
    selector: 'app-transferpage',
    templateUrl: './transferpage.component.html'
})
export class TransferPageComponent implements OnInit {

    @Input() mrecord: Tbl_edi_master;
    @Output() ModifiedRecords = new EventEmitter<any>();

    @ViewChild('_branch_code') branch_code_field: ElementRef;
    @ViewChild('_ref_date') ref_date_field: DateComponent;
    @ViewChild('_handled_lov') handled_lov_field: AutoComplete2Component;

    errorMessage: string;
    menuid: string;
    title: string;

    records: Tbl_edi_house[]
    is_locked: boolean = false;
    CompList: any[];

    handled_name: string = "";
    handled_id: string = "";
    ref_date: string = "";
    branch_code: string = "";

    constructor(
        private route: ActivatedRoute,
        private location: Location,
        public gs: GlobalService,
        public mainservice: ShipDataPageService
    ) { }

    ngOnInit() {
        this.LoadCompany();
        this.List('SCREEN');
        this.ref_date = this.gs.defaultValues.today;
        this.branch_code = this.gs.branch_code;
    }

    List(action: string = '') {
        var SearchData = this.gs.UserInfo;
        if (this.gs.isBlank(this.mrecord.masterid))
            SearchData.MASTERID = '';
        else
            SearchData.MASTERID = this.mrecord.masterid;
        this.mainservice.HouseList(SearchData).subscribe(response => {
            this.records = response.list;
            if (!this.gs.isBlank(this.records)) {
                if (this.records.length > 0) {
                    if (this.records[0].handled_id.length > 0) {
                        this.handled_id = this.records[0].handled_id;
                        this.handled_name = this.records[0].handled_name;
                    }
                }
            }
            this.ref_date_field.Focus();
        }, error => {
            this.errorMessage = this.gs.getError(error)
            alert(this.errorMessage);
        });
    }

    LoadCompany() {
        this.CompList = <any[]>[];
        this.gs.CompanyList.forEach(Rec => {
            if (Rec.comp_code != 'ALL')
                this.CompList.push(Rec);
        });
    }

    LovSelected(_Record: SearchTable) {

        if (_Record.controlname == "HANDLEDBY") {
            this.handled_id = _Record.id;
            this.handled_name = _Record.name;
            //this.salesman_lov_field.Focus();
        }
    }

    ImportMaster() {
        if (this.gs.isBlank(this.ref_date)) {
            alert("Ref Date cannot be blank");
            this.ref_date_field.Focus();
            return;
        }
        if (this.gs.isBlank(this.branch_code)) {
            alert("Branch cannot be blank");
            this.branch_code_field.nativeElement.focus();
            return;
        }
        if (this.gs.isBlank(this.handled_id)) {
            alert("A/N Handled By cannot be blank");
            this.handled_lov_field.Focus();
            return;
        }

        this.TransferData(true);
    }

    TransferData(chkMblDup: boolean) {

        var SearchData = this.gs.UserInfo;
        if (this.gs.isBlank(this.mrecord.masterid))
            SearchData.MASTERID = '';
        else
            SearchData.MASTERID = this.mrecord.masterid;
        SearchData.REF_DATE = this.ref_date;
        SearchData.HANDLED_ID = this.handled_id;
        SearchData.REC_COMPANY_CODE = this.gs.company_code;
        SearchData.REC_BRANCH_CODE = this.branch_code;
        SearchData.DUP_CHK_ONLY = "N";
        SearchData.CHK_MBL_DUP = chkMblDup == true ? "Y" : "N";
        this.mainservice.TransferData(SearchData).subscribe(response => {
            if (response.retvalue == true) {
                if (response.warningmsg.trim().length > 0) {
                    if (confirm(response.warningmsg)) {
                        this.TransferData(false);
                    }
                } else {
                    if (this.ModifiedRecords != null)
                        this.ModifiedRecords.emit({ saction: 'CLOSE' });
                }
            }

        }, error => {
            this.errorMessage = this.gs.getError(error)
            alert(this.errorMessage);
        });
    }

    Close() {
        if (this.ModifiedRecords != null)
            this.ModifiedRecords.emit({ saction: 'CLOSE' });
    }


    DeleteRow(_rec: Tbl_edi_house) {
        let sRemarks: string = "";
        this.errorMessage = '';

        if (!confirm("DELETE HOUSE NO : " + _rec.houseno)) {
            return;
        }
        var SearchData = this.gs.UserInfo;
        SearchData.pkid = _rec.houseid;
        SearchData.remarks = sRemarks;
        this.mainservice.DeleteHouseRecord(SearchData)
            .subscribe(response => {
                if (response.retvalue == false) {
                    this.errorMessage = response.error;
                    alert(this.errorMessage);
                }
                else {
                    for (let rec of this.records.filter(rec => rec.houseid == _rec.houseid)) {
                        rec.deleted = "Y";
                    }
                }
            }, error => {
                this.errorMessage = this.gs.getError(error);
                alert(this.errorMessage);
            });
    }

}
