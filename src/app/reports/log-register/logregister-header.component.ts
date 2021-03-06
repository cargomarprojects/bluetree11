import { Component, OnInit, Input, Output, EventEmitter, SimpleChange, ChangeDetectionStrategy } from '@angular/core';
import { GlobalService } from '../../core/services/global.service';
import { SearchQuery } from '../models/Tbl_Audit';

@Component({
    selector: 'app-logregister-header',
    templateUrl: './logregister-header.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LogRegisterHeaderComponent implements OnInit {
    // Call By Value using Input Parameters
    searchQuery: SearchQuery;
    @Input() set _query(value: SearchQuery) {
        this.searchQuery = Object.assign({}, value);
    }
    @Output() searchEvents = new EventEmitter<any>();

    constructor(public gs: GlobalService
    ) { }

    ngOnInit() {
    }

    ngOnChanges(changes: SimpleChange) {
    }

    List(outputformat: string) {
        if (this.gs.isBlank(this.searchQuery.searchString))
            this.searchQuery.searchString = '';

        if (this.gs.isBlank(this.searchQuery.fromdate))
            this.searchQuery.fromdate = this.gs.defaultValues.today;
        if (this.gs.isBlank(this.searchQuery.todate))
            this.searchQuery.todate = this.gs.defaultValues.today;
        this.searchEvents.emit({ outputformat: outputformat, searchQuery: this.searchQuery });
    }
}
