import { Component, OnInit, Input, Output, EventEmitter, SimpleChange, ChangeDetectionStrategy } from '@angular/core';
import { GlobalService } from '../../core/services/global.service';
import { SearchQuery } from '../models/tbl_cargo_general';
import { SearchTable } from '../../shared/models/searchtable';

@Component({
  selector: 'app-alertlogpage-header',
  templateUrl: './alertlogpage-header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AlertLogPageHeaderComponent implements OnInit {
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

  LovSelected(_Record: SearchTable) {
    if (_Record.controlname == "SALESMAN") {
      this.searchQuery.handled_id = _Record.id;
      this.searchQuery.handled_name = _Record.name;
    }
  }
  
}
