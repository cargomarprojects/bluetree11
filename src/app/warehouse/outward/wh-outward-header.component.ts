import { Component, OnInit, Input, Output, EventEmitter, SimpleChange, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { GlobalService } from '../../core/services/global.service';
import { SearchQuery } from '../models/Tbl_wh_inwardm';

@Component({
  selector: 'app-wh-outward-header',
  templateUrl: './wh-outward-header.component.html'
})
export class WhOutwardHeaderComponent implements OnInit {
  
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

  onBlur(feild: string) {
    this.searchQuery.searchString = this.gs.trimAll( this.searchQuery.searchString.toUpperCase());
  }

  List(outputformat: string) {

    if (this.gs.isBlank(this.searchQuery.fromdate))
      this.searchQuery.fromdate = this.gs.year_start_date;
    if (this.gs.isBlank(this.searchQuery.todate))
      this.searchQuery.todate = this.gs.defaultValues.today;

    this.searchEvents.emit({ outputformat: outputformat, searchQuery: this.searchQuery });
  }
}
