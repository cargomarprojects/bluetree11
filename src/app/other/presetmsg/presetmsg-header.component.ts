import { Component, OnInit, Input, Output, EventEmitter, SimpleChange, ChangeDetectionStrategy } from '@angular/core';
import { GlobalService } from '../../core/services/global.service';
import { SearchQuery } from '../models/table_cargo_remarks';

@Component({
    selector: 'acc-presetmsg-header',
    templateUrl: './presetmsg-header.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PreSetMsgHeaderComponent implements OnInit {
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
      
    }

    ngOnChanges(changes: SimpleChange) {
    }

    List(outputformat: string) {
        this.searchEvents.emit({ outputformat: outputformat, searchQuery: this.searchQuery });
    }
}
