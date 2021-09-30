import { Component, OnInit, Input, Output, EventEmitter, SimpleChange, ChangeDetectionStrategy } from '@angular/core';
import { GlobalService } from '../../core/services/global.service';
import { SearchQuery } from '../models/Tbl_cargo_hblformat';
import { FormatPageService } from '../../master/services/formatpage.service';
import { SearchTable } from '../../shared/models/searchtable';

@Component({
  selector: 'app-formatpage-header',
  templateUrl: './formatpage-header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormatPageHeaderComponent implements OnInit {
  // Call By Value using Input Parameters
  searchQuery: SearchQuery;
  @Input() set _query(value: SearchQuery) {
    this.searchQuery = Object.assign({}, value);
  }

  remarks = '';
  @Input() set _remarks(value: string) {
    this.remarks = value ;
  }


  @Output() searchEvents = new EventEmitter<any>();

  @Output() scrollEvents = new EventEmitter<boolean>();

  constructor(public gs: GlobalService,
    public mainservice: FormatPageService
  ) {

  }

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChange) {
  }



  List(outputformat: string) {
    if (this.gs.isBlank(this.searchQuery.format_id)) {
      alert('Please select a format and continue...')
      return;
    }

    this.searchEvents.emit({ outputformat: outputformat, searchQuery: this.searchQuery });
  }

  LovSelected(_Record: SearchTable) {

    if (_Record.controlname == "FORMAT") {
      this.searchQuery.format_id = _Record.id;
      this.searchQuery.format_name = _Record.name;
      // this.liner_lov_field.Focus();
    }
  }

  detpagecallbackevent(params:any) {

  }
}
