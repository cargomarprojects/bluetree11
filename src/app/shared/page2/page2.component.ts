import { Component, OnInit, Input, Output, EventEmitter, SimpleChange, ChangeDetectionStrategy } from '@angular/core';
import { PageQuery } from '../models/pageQuery';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { bloomAdd } from '@angular/core/src/render3/di';

@Component({
  selector: 'App-Page2',
  templateUrl: './page2.component.html',
  changeDetection : ChangeDetectionStrategy.OnPush

})
export class Page2Component implements OnInit {

  @Input() set _pageQuery( value : PageQuery){
      this.pageQuery = Object.assign({}, value); 
  } 
  pageQuery: PageQuery;
  @Output() pageEvents = new EventEmitter<any>();

  constructor() {  }

  ngOnInit() {}

  ngOnChanges(changes: SimpleChange) {
  }

  ngDoCheck() {
  }

  List(outputformat: string, action: string) {

    var oldPage = this.pageQuery.page_current;
    if (this.pageQuery.page_current == -1)
      return;

    if (action == 'FIRST')
      this.pageQuery.page_current = 1;
    else if (action == 'PREV')
      this.pageQuery.page_current--;
    else if (action == 'NEXT')
      this.pageQuery.page_current++;
    else if (action == 'LAST')
      this.pageQuery.page_current = this.pageQuery.page_count;

    this.pageQuery.action = action;

    if (this.pageQuery.page_current <= 0)
      this.pageQuery.page_current = 1;
    if (this.pageQuery.page_current > this.pageQuery.page_count)
      this.pageQuery.page_current = this.pageQuery.page_count;

    if (this.pageQuery.page_current == oldPage)
      return;


    
    this.pageEvents.emit({ outputformat: outputformat, action: action, pageQuery: this.pageQuery });
  }

}
