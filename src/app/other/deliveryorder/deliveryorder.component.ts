
import { Component, OnInit, Input, OnDestroy, SimpleChange } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { GlobalService } from '../../core/services/global.service';
import { Tbl_cargo_imp_pickup } from '../models/tbl_cargo_imp_pickup';
import { SearchQuery } from '../models/tbl_cargo_imp_pickup';
import { PageQuery } from '../../shared/models/pageQuery';
import { DeliveryOrderService } from '../services/deliveryorder.service';

@Component({
  selector: 'app-deliveryorder',
  templateUrl: './deliveryorder.component.html'
})
export class DeliveryOrderComponent implements OnInit {

  // 02-07-2019 Created By Ajith  
 
  errorMessage$ : Observable<string> ;
  records$ :  Observable<Tbl_cargo_imp_pickup[]>;
  pageQuery$ : Observable<PageQuery>;
  searchQuery$ : Observable<SearchQuery>;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    public gs: GlobalService,
    public mainservice: DeliveryOrderService
  ) { }

  ngOnInit() {
    this.mainservice.init(this.route.snapshot.queryParams);
    this.initPage();
  }

  initPage() {
    
    this.records$ = this.mainservice.data$.pipe(map(res => res.records));
    this.searchQuery$ = this.mainservice.data$.pipe(map(res => res.searchQuery));
    this.pageQuery$ = this.mainservice.data$.pipe(map(res => res.pageQuery));    
    this.errorMessage$ = this.mainservice.data$.pipe(map(res => res.errormessage));

  }

  searchEvents(actions: any) {
    this.mainservice.Search(actions,  'SEARCH');
  }

  pageEvents(actions: any) {
    this.mainservice.Search(actions,'PAGE');
  }

  NewRecord() {
    if (!this.mainservice.canAdd) {
      alert('Insufficient User Rights')
      return;
    }

    let parameter = {
      menuid: this.mainservice.menuid,
      pkid: '',
      mode: 'ADD',
      parentid : '',
      pickCategory : 'GENERAL',
      origin: 'oth-deliveryorder-page',
    };
    this.gs.Naviagete('Silver.Other.Trans/DeliveryOrderEdit', JSON.stringify(parameter));

  }
  
  edit(_record: Tbl_cargo_imp_pickup) {
    if (!this.mainservice.canEdit) {
      alert('Insufficient User Rights')
      return;
    }

    let parameter = {
        menuid: this.mainservice.menuid,
        pkid: _record.pick_pkid,
        mode: 'EDIT',
        parentid : _record.pick_parentid,
        pickCategory : 'GENERAL',
        origin: 'oth-deliveryorder-page',
      };
      this.gs.Naviagete('Silver.Other.Trans/DeliveryOrderEdit', JSON.stringify(parameter));
  }

  Close() {
    this.location.back();
  }
 
}
