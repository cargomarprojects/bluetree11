import { Component, OnInit, Input, Output, EventEmitter, SimpleChange, ChangeDetectionStrategy } from '@angular/core';
import { GlobalService } from '../../core/services/global.service';
import { SearchQuery } from '../models/tbl_inv_list';
import { SearchTable } from '../../shared/models/searchtable';
import { InvoiceReportService } from '../services/invoicereport.service';

@Component({
    selector: 'app-invoice-report-header',
    templateUrl: './invoice-report-header.component.html',
    // changeDetection: ChangeDetectionStrategy.OnPush
})
export class InvoiceReportHeaderComponent implements OnInit {
    // Call By Value using Input Parameters
    searchQuery: SearchQuery;
    @Input() set _query(value: SearchQuery) {
        this.searchQuery = Object.assign({}, value);
        this.initData();
    }
    @Output() searchEvents = new EventEmitter<any>();

    constructor(public gs: GlobalService,
        public mainservice: InvoiceReportService
    ) { }

    ngOnInit() {

    }

    initData() {

    }

    ngOnChanges(changes: SimpleChange) {
    }

    List(outputformat: string) {
        // if (this.searchQuery.searchString != null)
        //     this.searchQuery.searchString = this.searchQuery.searchString.toUpperCase();
        this.searchEvents.emit({ outputformat: outputformat, searchQuery: this.searchQuery });
    }

    LovSelected(_Record: SearchTable) {

        if (_Record.controlname == "CUSTOMER") {
            this.searchQuery.cust_id = _Record.id;
            this.searchQuery.cust_name = _Record.name;
        }
    }
}
