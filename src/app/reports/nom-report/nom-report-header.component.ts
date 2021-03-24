import { Component, OnInit, Input, Output, EventEmitter, SimpleChange, ChangeDetectionStrategy } from '@angular/core';
import { GlobalService } from '../../core/services/global.service';
import { SearchQuery } from '../models/tbl_nom_list';
import { SearchTable } from '../../shared/models/searchtable';
import { NomReportService } from '../services/nomreport.service';

@Component({
    selector: 'app-nom-report-header',
    templateUrl: './nom-report-header.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NomReportHeaderComponent implements OnInit {
    // Call By Value using Input Parameters
    searchQuery: SearchQuery;
    @Input() set _query(value: SearchQuery) {
        this.searchQuery = Object.assign({}, value);
        this.initData();
    }
    @Output() searchEvents = new EventEmitter<any>();

    constructor(public gs: GlobalService,
        public mainservice: NomReportService
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

        if (_Record.controlname == "HANDLEDBY") {
            this.searchQuery.handled_id = _Record.id;
            this.searchQuery.handled_name = _Record.name;
        }
    }
}
