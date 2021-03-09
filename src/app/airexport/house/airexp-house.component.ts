import { Component, OnInit, Input, OnDestroy, SimpleChange } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { GlobalService } from '../../core/services/global.service';
import { Tbl_cargo_exp_housem } from '../models/tbl_cargo_exp_housem';
import { SearchQuery } from '../models/tbl_cargo_exp_masterm';
import { PageQuery } from '../../shared/models/pageQuery';

import { AirExpHouseService } from '../services/airexp-house.service';

@Component({
  selector: 'app-airexp-house',
  templateUrl: './airexp-house.component.html'
})
export class AirExpHouseComponent implements OnInit {

  /*
 01-07-2019 Created By Ajith  

*/

  errorMessage$: Observable<string>;
  records$: Observable<Tbl_cargo_exp_housem[]>;
  pageQuery$: Observable<PageQuery>;
  searchQuery$: Observable<SearchQuery>;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    public gs: GlobalService,
    public mainservice: AirExpHouseService
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
    this.mainservice.Search(actions, 'SEARCH');
  }

  pageEvents(actions: any) {
    this.mainservice.Search(actions, 'PAGE');
  }

  // NewRecord() {
  //   if (!this.mainservice.canAdd) {
  //     alert('Insufficient User Rights')
  //     return;
  //   }

  //   let parameter = {
  //     menuid: this.mainservice.menuid,
  //     pkid: '',
  //     type: this.mainservice.param_type,
  //     origin: 'airexp-house-page',
  //     mode: 'ADD'
  //   };
  //   this.gs.Naviagete('Silver.AirExport.Trans/AirExpHouseEditPage', JSON.stringify(parameter));

  // }
  edit(_record: Tbl_cargo_exp_housem) {
    if (!this.mainservice.canEdit) {
      alert('Insufficient User Rights')
      return;
    }

    let parameter = {
      menuid: this.mainservice.menuid,
      pkid: _record.hbl_pkid,
      parentid: _record.hbl_mbl_id,
      type: '',
      refno: '',
      origin: 'airexp-house-page',
      mode: 'EDIT'
    };
    this.gs.Naviagete('Silver.AirExport.Trans/AirExpHouseEditPage', JSON.stringify(parameter));
  }

  editmaster(_record: Tbl_cargo_exp_housem) {
    this.gs.LinkPage('REFNO', 'AIR EXPORT', _record.mbl_refno, _record.hbl_mbl_id,_record.hbl_pkid);
  }


  Close() {
    this.location.back();
  }


}
