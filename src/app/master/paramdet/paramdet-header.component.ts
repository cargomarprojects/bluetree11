import { Component, OnInit, Input, Output, EventEmitter,SimpleChange, ChangeDetectionStrategy } from '@angular/core';
import { GlobalService } from '../../core/services/global.service';
import { SearchQuery } from '../store/paramdet/paramdet-page.models';

@Component({
  selector: 'app-paramdet-header',
  templateUrl: './paramdet-header.component.html',
  changeDetection : ChangeDetectionStrategy.OnPush
})
export class ParamDetHeaderComponent implements OnInit {
  // Call By Value using Input Parameters
  query : SearchQuery;
  @Input() set _query( value : SearchQuery){
    this.query  = Object.assign({}, value);
  }
  
  @Output() searchEvents = new EventEmitter<any>();

  constructor(public gs: GlobalService) { }

  ngOnInit() {
  }

  ngOnChanges(changes:  SimpleChange ) {
  }

  List(outputformat: string) {
    this.searchEvents.emit({ outputformat: outputformat, searchQuery: this.query });
  }
  onBlur(field: string) {
    switch (field) {
      case 'searchString': {
        this.query.searchString = this.gs.trimAll(this.query.searchString.toUpperCase())
        break;
      }
    }
  }
}
