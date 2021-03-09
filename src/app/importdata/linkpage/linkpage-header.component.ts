import { Component, OnInit, Input, Output, EventEmitter, SimpleChange, ChangeDetectionStrategy } from '@angular/core';
import { GlobalService } from '../../core/services/global.service';
import { SearchQuery, Tbl_edi_link } from '../models/tbl_edi_link';
import { SearchTable } from '../../shared/models/searchtable';
import { LinkPageService } from '../services/linkpage.service';

@Component({
  selector: 'app-linkpage-header',
  templateUrl: './linkpage-header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LinkPageHeaderComponent implements OnInit {
  // Call By Value using Input Parameters
  searchQuery: SearchQuery;

  @Input() set _query(value: SearchQuery) {
    this.searchQuery = Object.assign({}, value);
  }

  @Output() searchEvents = new EventEmitter<any>();

  constructor(public gs: GlobalService,
    public mainservice: LinkPageService
  ) { }

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChange) {
  }

  List(outputformat: string) {
    this.searchEvents.emit({ outputformat: outputformat, searchQuery: this.searchQuery });
  }
 
}
