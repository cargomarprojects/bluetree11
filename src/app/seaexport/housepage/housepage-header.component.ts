import { Component, OnInit, Input, Output, EventEmitter, SimpleChange, ChangeDetectionStrategy } from '@angular/core';
import { GlobalService } from '../../core/services/global.service';
import { SearchQuery } from '../models/tbl_cargo_exp_housem';

@Component({
  selector: 'app-housepage-header',
  templateUrl: './housepage-header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HousePageHeaderComponent implements OnInit {
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

    if (this.gs.isBlank(this.searchQuery.fromdate))
      this.searchQuery.fromdate = this.gs.year_start_date;
    if (this.gs.isBlank(this.searchQuery.todate))
      this.searchQuery.todate = this.gs.defaultValues.today;

    this.searchEvents.emit({ outputformat: outputformat, searchQuery: this.searchQuery });
  }
}
