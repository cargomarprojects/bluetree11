import { Component, OnInit, Input, Output, EventEmitter, SimpleChange, ChangeDetectionStrategy } from '@angular/core';
import { GlobalService } from '../../core/services/global.service';
import { SearchQuery } from '../models/tbl_data_entry_report';
import { DataEntryReportService } from '../services/data_entry_report.service';
//CREATE-AJITH-25-10-2021
//EDIT-AJITH-26-10-2021

@Component({
    selector: 'app-data-entry-report-header',
    templateUrl: './data-entry-report-header.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DataEntryReportHeaderComponent implements OnInit {
    // Call By Value using Input Parameters
    searchQuery: SearchQuery;
    @Input() set _query(value: SearchQuery) {
        this.searchQuery = Object.assign({}, value);
    }
    @Output() searchEvents = new EventEmitter<any>();

    constructor(public gs: GlobalService,
        public mainservice: DataEntryReportService
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
        if (this.gs.isBlank(this.searchQuery.fromdate))
            this.searchQuery.fromdate = this.gs.defaultValues.today;
        if (this.gs.isBlank(this.searchQuery.todate))
            this.searchQuery.todate = this.gs.defaultValues.today;
        this.searchEvents.emit({ outputformat: outputformat, searchQuery: this.searchQuery });
    }
}
