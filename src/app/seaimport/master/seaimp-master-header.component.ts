import { Component, OnInit, Input, Output, EventEmitter,SimpleChange, ChangeDetectionStrategy,ViewChild } from '@angular/core';
import { GlobalService } from '../../core/services/global.service';
import { SearchQuery } from '../models/tbl_cargo_imp_masterm';
//import { DateComponent } from '../../shared/date/date.component';

@Component({
  selector: 'app-seaimp-master-header',
  templateUrl: './seaimp-master-header.component.html',
  changeDetection : ChangeDetectionStrategy.OnPush
})
export class SeaImpMasterHeaderComponent implements OnInit {
  // Call By Value using Input Parameters
  //@ViewChild('_si_frm_date') si_frm_date_field: DateComponent;
  
  searchQuery : SearchQuery;
  @Input() set _query( value : SearchQuery){
    this.searchQuery  = Object.assign({}, value);
  }
  
  @Output() searchEvents = new EventEmitter<any>();

  constructor(public gs: GlobalService
    ) { }

  ngOnInit() {
    //this.si_frm_date_field.Focus();
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
}
