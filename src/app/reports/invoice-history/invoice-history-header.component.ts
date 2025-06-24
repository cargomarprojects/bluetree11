import { Component, OnInit, Input, Output, EventEmitter, SimpleChange, ChangeDetectionStrategy } from '@angular/core';
import { GlobalService } from '../../core/services/global.service';
import { SearchQuery } from '../models/Tbl_inv_history';
import { InvHistoryService } from '../services/inv_history.service';
 
@Component({
    selector: 'app-invoice-history-header',
    templateUrl: './invoice-history-header.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class InvoiceHistoryHeaderComponent implements OnInit {
    // Call By Value using Input Parameters
    searchQuery: SearchQuery;
    @Input() set _query(value: SearchQuery) {
        this.searchQuery = Object.assign({}, value);
    }
    @Output() searchEvents = new EventEmitter<any>();

    constructor(public gs: GlobalService,
        public mainservice: InvHistoryService
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
