import { Component, OnInit, Input, Output, EventEmitter, SimpleChange, ChangeDetectionStrategy } from '@angular/core';
import { GlobalService } from '../../core/services/global.service';
import { SearchQuery } from '../models/Tbl_cargo_mblusage';

@Component({
    selector: 'acc-mblusage-header',
    templateUrl: './mblusage-header.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MblUsageHeaderComponent implements OnInit {
    // Call By Value using Input Parameters
    searchQuery: SearchQuery;
    @Input() set _query(value: SearchQuery) {
        this.searchQuery = Object.assign({}, value);
        this.initData();

    }
    @Output() searchEvents = new EventEmitter<any>();

    constructor(public gs: GlobalService
    ) { }

    ngOnInit() {

    }

    initData(){
        if (this.gs.isBlank(this.searchQuery.sdate))
            this.searchQuery.sdate = this.gs.defaultValues.lastmonthdate;        
        if (this.gs.isBlank(this.searchQuery.edate))
            this.searchQuery.edate = this.gs.defaultValues.today;        
    }

    ngOnChanges(changes: SimpleChange) {
    }

    List(outputformat: string) {
        if (this.gs.isBlank(this.searchQuery.sdate))
            this.searchQuery.sdate = this.gs.year_start_date;
        if (this.gs.isBlank(this.searchQuery.edate))
            this.searchQuery.edate = this.gs.defaultValues.today;
        this.searchEvents.emit({ outputformat: outputformat, searchQuery: this.searchQuery });
    }
}
