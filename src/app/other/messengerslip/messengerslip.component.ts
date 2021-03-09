
import { Component, OnInit, Input, OnDestroy, SimpleChange } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { GlobalService } from '../../core/services/global.service';
import { Tbl_cargo_slip } from '../models/tbl_cargo_slip';
import { SearchQuery } from '../models/tbl_cargo_slip';
import { PageQuery } from '../../shared/models/pageQuery';

import { MessengerSlipService } from '../services/messengerslip.service';


@Component({
  selector: 'app-messengerslip',
  templateUrl: './messengerslip.component.html'
})
export class MessengerSlipComponent implements OnInit {

  // 02-07-2019 Created By Ajith  
  
  errorMessage$ : Observable<string> ;
  records$ :  Observable<Tbl_cargo_slip[]>;
  pageQuery$ : Observable<PageQuery>;
  searchQuery$ : Observable<SearchQuery>;
  
  constructor(
    private route: ActivatedRoute,
    private location: Location,
    public gs: GlobalService,
    public mainservice: MessengerSlipService
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
      mbl_pkid : '',
      mbl_refno : '',
      mbl_mode:'GENERAL',
      origin: 'messengerslip-general-page'
    };
    this.gs.Naviagete('Silver.Other.Trans/MessengerSlipEdit', JSON.stringify(parameter));

  }
  
  edit(_record: Tbl_cargo_slip) {
    if (!this.mainservice.canEdit) {
      alert('Insufficient User Rights')
      return;
    }

    let parameter = {
        menuid: this.mainservice.menuid,
        pkid: _record.cs_pkid,
        mode: 'EDIT',
        mbl_pkid : '',
        mbl_refno : '',
        mbl_mode:'GENERAL',
        origin: 'messengerslip-general-page',
      };
      this.gs.Naviagete('Silver.Other.Trans/MessengerSlipEdit', JSON.stringify(parameter));
  }

  Close() {
    this.location.back();
  }

 
}
