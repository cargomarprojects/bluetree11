import { Component, OnInit, Input, Output, EventEmitter,SimpleChange, ChangeDetectionStrategy } from '@angular/core';
import { SearchQuery } from '../store/param/param-page.models';

@Component({
  selector: 'app-param-header',
  templateUrl: './param-header.component.html',
  changeDetection : ChangeDetectionStrategy.OnPush
})
export class ParamHeaderComponent implements OnInit {
  // Call By Value using Input Parameters
  query : SearchQuery;
  @Input() set _query( value : SearchQuery){
    this.query  = Object.assign({}, value);
  }
  
  @Output() searchEvents = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes:  SimpleChange ) {
  }

  List(outputformat: string) {
    this.searchEvents.emit({ outputformat: outputformat, searchQuery: this.query });
  }
}
