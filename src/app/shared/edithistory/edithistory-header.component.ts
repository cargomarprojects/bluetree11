import { Component, OnInit, Input, Output, EventEmitter, SimpleChange, ChangeDetectionStrategy } from '@angular/core';
import { GlobalService } from '../../core/services/global.service';
import { SearchQuery } from '../models/table_user_edit_history';

@Component({
  selector: 'app-edithistory-header',
  templateUrl: './edithistory-header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserEditHistoryHeaderComponent implements OnInit {
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
  onBlur(feild: string) {
    this.searchQuery.searchString = this.searchQuery.searchString.toUpperCase();
  }

  
  List(outputformat: string) {
    this.searchEvents.emit({ outputformat: outputformat, searchQuery: this.searchQuery });
  }
}
