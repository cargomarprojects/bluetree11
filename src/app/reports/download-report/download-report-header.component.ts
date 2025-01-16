import { Component, OnInit, Input, Output, EventEmitter, SimpleChange, ChangeDetectionStrategy } from '@angular/core';
import { GlobalService } from '../../core/services/global.service';
import { SearchQuery } from '../models/tbl_download_report';
import { DownloadReportService } from '../services/download_report.service';
import { SearchTable } from '../../shared/models/searchtable';

@Component({
    selector: 'app-download-report-header',
    templateUrl: './download-report-header.component.html',
    // changeDetection: ChangeDetectionStrategy.OnPush
})
export class DownloadReportHeaderComponent implements OnInit {
    // Call By Value using Input Parameters
    searchQuery: SearchQuery;
    @Input() set _query(value: SearchQuery) {
        this.searchQuery = Object.assign({}, value);
    }
    @Output() searchEvents = new EventEmitter<any>();

    constructor(public gs: GlobalService,
        public mainservice: DownloadReportService
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

    LovSelected(_Record: SearchTable) {

        if (_Record.controlname == "AGENT") {
            this.searchQuery.agentId = _Record.id;
            this.searchQuery.agentName = _Record.name;
        }
        if (_Record.controlname == "CARRIER") {
            this.searchQuery.carrierId = _Record.id;
            this.searchQuery.carrierName = _Record.name;
        }
    }
}