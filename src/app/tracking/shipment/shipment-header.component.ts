import { Component, OnInit, Input, Output, EventEmitter,SimpleChange, ChangeDetectionStrategy,ViewChild } from '@angular/core';
import { GlobalService } from '../../core/services/global.service';
import { SearchQuery } from '../models/cargo_masterm';


@Component({
  selector: 'app-shipment-header',
  templateUrl: './shipment-header.component.html',
  changeDetection : ChangeDetectionStrategy.OnPush
})
export class ShipmentHeaderComponent implements OnInit {
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
