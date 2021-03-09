import { Component, OnInit, Input, Output, EventEmitter, SimpleChange, ChangeDetectionStrategy } from '@angular/core';
import { GlobalService } from '../../core/services/global.service';
import { SearchQuery } from '../models/Tbl_Acc_Payment';
import { SearchTable } from '../../shared/models/searchtable';

@Component({
    selector: 'acc-payment-header',
    templateUrl: './payment-header.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentHeaderComponent implements OnInit {
    // Call By Value using Input Parameters
    searchQuery: SearchQuery;
    custLovType: string = 'MASTER';

    @Input() set _query(value: SearchQuery) {
        this.searchQuery = Object.assign({}, value);
        this.initData();

    }
    @Output() searchEvents = new EventEmitter<any>();

    constructor(public gs: GlobalService
    ) { }

    ngOnInit() {

    }

    initData() {
        if (this.gs.isBlank(this.searchQuery.sdate))
            this.searchQuery.sdate = this.gs.defaultValues.lastmonthdate;
        if (this.gs.isBlank(this.searchQuery.edate))
            this.searchQuery.edate = this.gs.defaultValues.today;
    }

    ngOnChanges(changes: SimpleChange) {
    }

    List(outputformat: string) {
        if (this.gs.isBlank(this.searchQuery.sdate))
            this.searchQuery.sdate = this.gs.year_start_date;
        if (this.gs.isBlank(this.searchQuery.edate))
            this.searchQuery.edate = this.gs.defaultValues.today;
        this.searchEvents.emit({ outputformat: outputformat, searchQuery: this.searchQuery });
    }

    LovSelected(_Record: SearchTable) {
        if (_Record.controlname === 'CUSTOMER') {
            this.searchQuery.customerId = _Record.id;
            this.searchQuery.customerCode = _Record.code;
            this.searchQuery.customerName = _Record.name;
        }
        // if (_Record.controlname === 'PARENT') {
        //   this.cust_parent_id = _Record.id;
        //   this.cust_parent_name = _Record.name;
        // }
    }
    onChange(field: string) {

        if (field === 'searchCustType') {
            this.searchQuery.customerId = '';
            this.searchQuery.customerCode = '';
            this.searchQuery.customerName = '';
            if (this.searchQuery.searchType === 'CUSTOMER')
                this.custLovType = 'MASTER';
            else
                this.custLovType = 'OVERSEAAGENT';
        }
    }
}
