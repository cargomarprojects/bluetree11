import { Component, OnInit, Input, Output, EventEmitter,SimpleChange, ChangeDetectionStrategy } from '@angular/core';
import { GlobalService } from '../../core/services/global.service';
import { SearchQuery } from '../models/tbl_cargo_general';
import { SearchTable } from '../../shared/models/searchtable';

@Component({
  selector: 'app-lockunlock-header',
  templateUrl: './lockunlock-header.component.html',
  changeDetection : ChangeDetectionStrategy.OnPush
})
export class LockUnlockHeaderComponent implements OnInit {
  // Call By Value using Input Parameters
  searchQuery : SearchQuery;
  @Input() set _query( value : SearchQuery){
    this.searchQuery  = Object.assign({}, value);
  }
  
  @Output() searchEvents = new EventEmitter<any>();

  constructor(public gs: GlobalService
    ) { }

  ngOnInit() {
  }

  ngOnChanges(changes:  SimpleChange ) {
  }

  List(outputformat: string) {

    if (this.gs.isBlank(this.searchQuery.fromdate))
      this.searchQuery.fromdate = this.gs.year_start_date;
    if (this.gs.isBlank(this.searchQuery.todate))
      this.searchQuery.todate = this.gs.defaultValues.today;

    this.searchEvents.emit({ outputformat: outputformat, searchQuery: this.searchQuery });
  }


  LovSelected(_Record: SearchTable) {
    if (_Record.controlname == "AGENT") {
      this.searchQuery.cust_id = _Record.id;
      this.searchQuery.cust_name = _Record.name;
    }
  }
}
