import { Component, OnInit, Input, Output, EventEmitter, SimpleChange, ChangeDetectionStrategy } from '@angular/core';
import { GlobalService } from '../../core/services/global.service';
import { SearchQuery } from '../models/tbl_cargo_qtnm';
import { QtnFclService } from '../services/qtnfcl.service';

@Component({
  selector: 'app-qtnfcl-header',
  templateUrl: './qtnfcl-header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QtnFclHeaderComponent implements OnInit {
  // Call By Value using Input Parameters
  searchQuery: SearchQuery;
  @Input() set _query(value: SearchQuery) {
    this.searchQuery = Object.assign({}, value);
  }

  @Output() searchEvents = new EventEmitter<any>();

  constructor(public gs: GlobalService,
    public mainservice: QtnFclService
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
