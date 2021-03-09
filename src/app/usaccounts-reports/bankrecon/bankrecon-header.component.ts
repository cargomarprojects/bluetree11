import { Component, OnInit, Input, Output, EventEmitter, SimpleChange, ChangeDetectionStrategy } from '@angular/core';
import { GlobalService } from '../../core/services/global.service';
import { SearchQuery } from '../models/Tbl_acc_ledger';
import { SearchTable } from '../../shared/models/searchtable';
import { BankReconService } from '../services/bankrecon.service';

@Component({
    selector: 'bankrecon-header',
    templateUrl: './bankrecon-header.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BankReconHeaderComponent implements OnInit {
    // Call By Value using Input Parameters
    searchQuery: SearchQuery;

    @Input() set _query(value: SearchQuery) {
        this.searchQuery = Object.assign({}, value);
        this.initData();
    }
    @Output() searchEvents = new EventEmitter<any>();

    constructor(public gs: GlobalService,
                public mainservice: BankReconService
    ) { }

    ngOnInit() {

    }

    initData() {
    }

    ngOnChanges(changes: SimpleChange) {
    }

    List(outputformat: string) {
        if (outputformat == "PASSBOOK-BAL") {
            if (this.gs.isBlank(this.searchQuery.sdate)) {
                this.searchQuery.sdate = this.gs.year_start_date;
            }
            if (this.gs.isBlank(this.searchQuery.edate)) {
                this.searchQuery.edate = this.gs.defaultValues.today;
            }
            if (this.gs.isBlank(this.searchQuery.accId)) {
                alert("Code cannot be empty");
                return;
            }
        }

        if (outputformat == "SCREEN") {
            if (this.searchQuery.chkreconciled == false && this.searchQuery.chkunreconciled == false) {
                alert("Either Reconciled / Un-Reconciled should be selected");
                return;
            }
        }

        this.searchEvents.emit({ outputformat: outputformat, searchQuery: this.searchQuery });
    }

    LovSelected(_Record: SearchTable) {
        if (_Record.controlname === 'ACCTM') {
            this.searchQuery.accId = _Record.id;
            this.searchQuery.accCode = _Record.code;
            this.searchQuery.accName = _Record.name;
        }
    }

    
}
