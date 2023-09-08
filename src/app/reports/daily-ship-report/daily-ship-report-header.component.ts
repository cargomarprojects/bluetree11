import { Component, OnInit, Input, Output, EventEmitter, SimpleChange, ChangeDetectionStrategy } from '@angular/core';
import { now } from 'lodash';
import { GlobalService } from '../../core/services/global.service';
import { SearchQuery } from '../models/tbl_daily_ship_report';
import { DailyShipReportService } from '../services/daily_ship_report.service';
import { SearchTable } from '../../shared/models/searchtable';

@Component({
    selector: 'app-daily-ship-report-header',
    templateUrl: './daily-ship-report-header.component.html',
    // changeDetection: ChangeDetectionStrategy.OnPush
})
export class DailyShipReportHeaderComponent implements OnInit {
    // Call By Value using Input Parameters
    searchQuery: SearchQuery;
    @Input() set _query(value: SearchQuery) {
        this.searchQuery = Object.assign({}, value);
    }
    @Output() searchEvents = new EventEmitter<any>();

    constructor(public gs: GlobalService,
        public mainservice: DailyShipReportService
    ) { }

    ngOnInit() {
    }

    ngOnChanges(changes: SimpleChange) {
    }

    onBlur(field: string) {
        switch (field) {
            // case 'searchString': {
            //     this.searchQuery.searchString = this.searchQuery.searchString.toUpperCase();
            //     break;
            // }
        }
    }

    LovSelected(_Record: SearchTable) {
        if (_Record.controlname === 'CUSTOMER') {
            this.searchQuery.cust_id = _Record.id;
            this.searchQuery.cust_name = _Record.name;
        }
        if (_Record.controlname === 'PARENT') {
            this.searchQuery.cust_parent_id = _Record.id;
            this.searchQuery.cust_parent_name = _Record.name;
        }
        if (_Record.controlname === 'SHIPPER') {
            this.searchQuery.shipper_id = _Record.id;
            this.searchQuery.shipper_name = _Record.name;
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
