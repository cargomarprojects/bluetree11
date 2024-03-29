import { Component, OnInit, Input, Output, EventEmitter, SimpleChange, ChangeDetectionStrategy } from '@angular/core';
import { GlobalService } from '../../core/services/global.service';
import { SearchQuery } from '../models/tbl_cust_report';
import { CustReportService } from '../services/cust_report.service';
//CREATE-AJITH-08-10-2021

@Component({
    selector: 'app-cust-report-header',
    templateUrl: './cust-report-header.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustReportHeaderComponent implements OnInit {
    // Call By Value using Input Parameters
    searchQuery: SearchQuery;
    @Input() set _query(value: SearchQuery) {
        this.searchQuery = Object.assign({}, value);
    }
    @Output() searchEvents = new EventEmitter<any>();

    constructor(public gs: GlobalService,
        public mainservice: CustReportService
    ) { }

    ngOnInit() {
    }

    ngOnChanges(changes: SimpleChange) {
    }

    onBlur(field: string) {
        switch (field) {
            case 'searchString': {
                this.searchQuery.searchString = this.searchQuery.searchString.toUpperCase();
                break;
            }
        }
    }

    List(outputformat: string) {
        if (this.gs.isBlank(this.searchQuery.searchString))
            this.searchQuery.searchString = '';
        // if (this.gs.isBlank(this.searchQuery.fromdate))
        //     this.searchQuery.fromdate = this.gs.year_start_date;
        // if (this.gs.isBlank(this.searchQuery.todate))
        //     this.searchQuery.todate = this.gs.defaultValues.today;
        this.searchEvents.emit({ outputformat: outputformat, searchQuery: this.searchQuery });
    }
}
