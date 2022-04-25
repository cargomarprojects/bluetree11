import { Component, OnInit, Input, Output, EventEmitter, SimpleChange, ChangeDetectionStrategy } from '@angular/core';
import { GlobalService } from '../../core/services/global.service';
import { SearchQuery } from '../models/Tbl_User_Active';

@Component({
    selector: 'app-useractive-header',
    templateUrl: './useractive-header.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserActiveHeaderComponent implements OnInit {
    // Call By Value using Input Parameters
    searchQuery: SearchQuery;
    @Input() set _query(value: SearchQuery) {
        this.searchQuery = Object.assign({}, value);
    }
    @Output() searchEvents = new EventEmitter<any>();

    interval: any;
    report_auto_refresh: boolean = false;

    constructor(public gs: GlobalService
    ) { }

    ngOnInit() {
    }

    ngOnDestroy() {
        this.stopTimer();
    }

    ngOnChanges(changes: SimpleChange) {
    }

    List(outputformat: string) {
        if (this.gs.isBlank(this.searchQuery.searchString))
            this.searchQuery.searchString = '';
        this.searchEvents.emit({ outputformat: outputformat, searchQuery: this.searchQuery });
    }

    setAutoRefresh() {
        this.report_auto_refresh = !this.report_auto_refresh;
    }

    onChange(_field: string) {

        if (_field == 'report_auto_refresh') {

            if (this.report_auto_refresh) {
                this.startTimer();
            } else {
                this.stopTimer();
            }
        }

    }

    startTimer() {
        this.interval = setInterval(() => {
            this.List('SCREEN');
        }, 60000) //time tick interval per one minute
    }
    
    stopTimer() {
        clearInterval(this.interval);
    }
}
