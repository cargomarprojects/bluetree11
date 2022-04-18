import { Component, OnInit, Input, Output, EventEmitter, SimpleChange, ChangeDetectionStrategy } from '@angular/core';
import { GlobalService } from '../../core/services/global.service';
import { SearchQuery } from '../models/Tbl_Acc_Payment';

@Component({
    selector: 'acc-paysearch-header',
    templateUrl: './paysearch-header.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaySearchHeaderComponent implements OnInit {
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
        if (this.searchQuery.searchType == "CHECK AMOUNT" || this.searchQuery.searchType == "INVOICE AMOUNT") {
            if (this.gs.isBlank(this.searchQuery.searchString)) {
                alert('Search Amount Cannot be Blank');
                return;
            }
        }
        this.searchEvents.emit({ outputformat: outputformat, searchQuery: this.searchQuery });
    }
    onBlur(field: string) {
        switch (field) {
            case 'searchString': {
                this.searchQuery.searchString = this.gs.trimAll(this.searchQuery.searchString.toUpperCase())
                break;
            }
        }
    }

}
