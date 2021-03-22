import { Component, OnInit, Input, Output, EventEmitter, SimpleChange, ChangeDetectionStrategy } from '@angular/core';
import { GlobalService } from '../../core/services/global.service';
import { SearchQuery } from '../models/tbl_gen_search';
import { SearchTable } from '../../shared/models/searchtable';

@Component({
    selector: 'app-gen-search-header',
    templateUrl: './gen-search-header.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GenSearchHeaderComponent implements OnInit {
    // Call By Value using Input Parameters
    searchQuery: SearchQuery;
    customer_id: string = '';
    customer_name: string = '';
    port_id: string = '';
    port_name: string = '';
    carrier_id: string = '';
    carrier_name: string = '';
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

        if (this.searchQuery.searchType == 'ADDRESS BOOK')
            this.searchQuery.customerId = this.customer_id;
        else if (this.searchQuery.searchType == 'PORT CODE')
            this.searchQuery.customerId = this.port_id;
        else if (this.searchQuery.searchType == 'CARRIER')
            this.searchQuery.customerId = this.carrier_id;
        else
            this.searchQuery.customerId = '';
        this.searchEvents.emit({ outputformat: outputformat, searchQuery: this.searchQuery });
    }

    LovSelected(_Record: SearchTable) {

        if (_Record.controlname == "CUSTOMER") {
            this.customer_id = _Record.id;
            this.customer_name = _Record.name;
        }
        if (_Record.controlname == "PORT") {
            this.port_id = _Record.id;
            this.port_name = _Record.name;
        }
        if (_Record.controlname == "CARRIER") {
            this.carrier_id = _Record.id;
            this.carrier_name = _Record.name;
        }
    }
}
