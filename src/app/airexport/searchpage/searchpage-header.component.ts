import { Component, OnInit, Input, Output, EventEmitter, SimpleChange, ChangeDetectionStrategy } from '@angular/core';
import { GlobalService } from '../../core/services/global.service';
import { SearchQuery } from '../models/tbl_search';
import { SearchPageService } from '../services/searchpage.service';
//EDIT-AJITH-21-09-2021
//EDIT-AJITH-23-09-2021

@Component({
  selector: 'app-searchpage-header',
  templateUrl: './searchpage-header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchPageHeaderComponent implements OnInit {
  // Call By Value using Input Parameters


  searchQuery: SearchQuery;
  @Input() set _query(value: SearchQuery) {
    this.searchQuery = Object.assign({}, value);
  }

  @Output() searchEvents = new EventEmitter<any>();

  constructor(public gs: GlobalService,
    public mainservice: SearchPageService
  ) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChange) {
  }

  OnChange(field: string) {
    if (field == 'searchType') {
      this.mainservice.ClearList();
      // this.searchQuery.searchString = '';
      this.searchQuery.isParentChecked = false;
      this.searchQuery.isHouseChecked = false;
      this.mainservice.search_type = this.searchQuery.searchType;
    }
  }

  List(outputformat: string) {
    this.searchEvents.emit({ outputformat: outputformat, searchQuery: this.searchQuery });
  }
  onBlur(field: string) {
    switch (field) {
      case 'searchString': {
        this.searchQuery.searchString = this.searchQuery.searchString.toUpperCase()
        break;
      }
    }
  }

}
