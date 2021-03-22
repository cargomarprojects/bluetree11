import { Component, OnInit, Input, Output, EventEmitter, SimpleChange, ChangeDetectionStrategy } from '@angular/core';
import { GlobalService } from '../../core/services/global.service';
import { SearchQuery } from '../models/tbl_gen_search';

@Component({
    selector: 'app-gen-search-header',
    templateUrl: './gen-search-header.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GenSearchHeaderComponent implements OnInit {
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

    initData() {
    }

    ngOnChanges(changes: SimpleChange) {
    }

    List(outputformat: string) {
        if (this.searchQuery.searchString != null)
            this.searchQuery.searchString = this.searchQuery.searchString.toUpperCase();
        this.searchEvents.emit({ outputformat: outputformat, searchQuery: this.searchQuery });
    }
}
