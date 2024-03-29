import { Component, OnInit, Input, Output, EventEmitter, SimpleChange, ChangeDetectionStrategy } from '@angular/core';
import { GlobalService } from '../../core/services/global.service';
import { SearchQuery } from '../models/Tbl_Email_jobs';
import { EmailReportService } from '../services/email_report.service';

@Component({
    selector: 'app-email-report-header',
    templateUrl: './email-report-header.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmailReportHeaderComponent implements OnInit {
    // Call By Value using Input Parameters
    searchQuery: SearchQuery;
    @Input() set _query(value: SearchQuery) {
        this.searchQuery = Object.assign({}, value);
    }
    @Output() searchEvents = new EventEmitter<any>();

    constructor(public gs: GlobalService,
        public mainservice: EmailReportService
    ) { }

    ngOnInit() {
    }

    ngOnDestroy() {
    }

    ngOnChanges(changes: SimpleChange) {
    }

    List(outputformat: string) {
        if (this.gs.isBlank(this.searchQuery.searchString))
            this.searchQuery.searchString = '';
        this.searchEvents.emit({ outputformat: outputformat, searchQuery: this.searchQuery });
    }

    onChange(_field: string) {
    }

}
