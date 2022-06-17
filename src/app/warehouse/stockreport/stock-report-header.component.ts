import { Component, OnInit, Input, Output, EventEmitter, SimpleChange, ChangeDetectionStrategy } from '@angular/core';
import { now } from 'lodash';
import { GlobalService } from '../../core/services/global.service';
import { SearchQuery } from '../models/Tbl_stock_report';
import { StockReportService } from '../services/stock_report.service';

@Component({
    selector: 'app-stock-report-header',
    templateUrl: './stock-report-header.component.html'
})
export class StockReportHeaderComponent implements OnInit {
    // Call By Value using Input Parameters
    searchQuery: SearchQuery;
    @Input() set _query(value: SearchQuery) {
        this.searchQuery = Object.assign({}, value);
    }
    @Output() searchEvents = new EventEmitter<any>();

    constructor(public gs: GlobalService,
        public mainservice: StockReportService
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
        this.searchEvents.emit({ outputformat: outputformat, searchQuery: this.searchQuery });
    }
}
