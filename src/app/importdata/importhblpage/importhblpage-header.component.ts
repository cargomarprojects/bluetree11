import { Component, OnInit, Input, Output, EventEmitter, SimpleChange, ChangeDetectionStrategy } from '@angular/core';
import { GlobalService } from '../../core/services/global.service';
import { SearchQuery } from '../models/tbl_mast_files';
import { SearchTable } from '../../shared/models/searchtable';
import { ImportHblPageService } from '../services/importhblpage.service';

@Component({
  selector: 'app-importhblpage-header',
  templateUrl: './importhblpage-header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImportHblPageHeaderComponent implements OnInit {
  // Call By Value using Input Parameters
  searchQuery: SearchQuery;

  @Input() set _query(value: SearchQuery) {
    this.searchQuery = Object.assign({}, value);
  }

  @Output() searchEvents = new EventEmitter<any>();

  constructor(public gs: GlobalService,
    public mainservice: ImportHblPageService
  ) { }

  ngOnInit() {
   
  }

  ngOnChanges(changes: SimpleChange) {
  }

  List(outputformat: string) {
    this.searchEvents.emit({ outputformat: outputformat, searchQuery: this.searchQuery });
  }

}
