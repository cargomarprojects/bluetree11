import { Component, OnInit, Input, Output, EventEmitter, SimpleChange, ChangeDetectionStrategy } from '@angular/core';
import { GlobalService } from '../../core/services/global.service';
import { SearchQuery } from '../models/tbl_cargo_journals_master';

@Component({
  selector: 'app-salesjournals-header',
  templateUrl: './salesjournals-header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SalesJournalsHeaderComponent implements OnInit {
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
    this.searchEvents.emit({ outputformat: outputformat, searchQuery: this.searchQuery });
  }
}
