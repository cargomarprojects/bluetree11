
import { Component, OnInit, Input, OnDestroy, SimpleChange } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { GlobalService } from '../../core/services/global.service';
import { cargo_masterm } from '../models/cargo_masterm';
import { SearchQuery } from '../models/cargo_masterm';
import { PageQuery } from '../../shared/models/pageQuery';

import { ShipmentService } from '../services/shipment.service';
//EDIT-AJITH-09-09-2021

@Component({
  selector: 'app-shipment',
  templateUrl: './shipment.component.html'
})
export class ShipmentComponent implements OnInit {

  // 21-04-2021 Created By joy
 
  errorMessage$ : Observable<string> ;
  records$ :  Observable<cargo_masterm[]>;
  pageQuery$ : Observable<PageQuery>;
  searchQuery$ : Observable<SearchQuery>;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    public gs: GlobalService,
    public mainservice: ShipmentService
  ) { }

  ngOnInit() {
    this.gs.checkAppVersion();
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

  
  edit(_record: cargo_masterm) {
    if (!this.mainservice.canEdit) {
      alert('Insufficient User Rights')
      return;
    }

    let parameter = {
      appid: this.gs.appid,
      menuid: this.mainservice.menuid,
      pkid: _record.mbl_pkid,
      type: '',
      origin: 'seaimp-master-page',
      mode: 'EDIT'
    };
    this.gs.Naviagete2('Silver.SeaImport/SeaImpMasterEditPage',  parameter);
  }

  Close() {
    this.location.back();
  }

 
}
