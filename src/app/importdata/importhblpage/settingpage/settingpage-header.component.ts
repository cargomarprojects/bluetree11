import { Component, OnInit, Input, Output, EventEmitter, SimpleChange, ChangeDetectionStrategy,ViewChild } from '@angular/core';
import { GlobalService } from '../../../core/services/global.service';
 import { SearchQuery } from '../../models/tbl_edi_link';
import { SearchTable } from '../../../shared/models/searchtable';
import { InputBoxComponent } from '../../../shared/input/inputbox.component';

@Component({
  selector: 'app-settingpage-header',
  templateUrl: './settingpage-header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingPageHeaderComponent implements OnInit {
  // Call By Value using Input Parameters
  searchQuery: SearchQuery;

  @Input() set _query(value: SearchQuery) {
    this.searchQuery = Object.assign({}, value);
  }
 
  @Output() searchEvents = new EventEmitter<any>();
  @ViewChild('_searchstring') searchstring_ctrl: InputBoxComponent;
  
  constructor(public gs: GlobalService
  ) { }

  ngOnInit() {
   this.searchstring_ctrl.focus();
  }

  ngOnChanges(changes: SimpleChange) {
  }

  List(outputformat: string) {
    this.searchEvents.emit({ outputformat: outputformat, searchQuery: this.searchQuery });
  }

}
