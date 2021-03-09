
import { Component, OnInit, Input, OnDestroy, SimpleChange } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { GlobalService } from '../../core/services/global.service';
import { Tbl_cargo_imp_housem } from '../models/tbl_cargo_imp_housem';
import { SearchQuery } from '../models/tbl_cargo_imp_housem';
import { PageQuery } from '../../shared/models/pageQuery';

import { AirImpHouseService } from '../services/airimp-house.service';

@Component({
  selector: 'app-airimp-house',
  templateUrl: './airimp-house.component.html'
})
export class AirImpHouseComponent implements OnInit {

  // 02-07-2019 Created By Ajith  
 

  errorMessage$ : Observable<string> ;
  records$ :  Observable<Tbl_cargo_imp_housem[]>;
  pageQuery$ : Observable<PageQuery>;
  searchQuery$ : Observable<SearchQuery>;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    public gs: GlobalService,
    public mainservice: AirImpHouseService
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

  // NewRecord() {


  //   let parameter = {
  //     menuid: this.mainservice.menuid,
  //     pkid: '',
  //     parentid :'',
  //     type: this.mainservice.param_type,
  //     origin: 'airimp-house-page',
  //     mode: 'ADD'
  //   };
  //   this.gs.Naviagete('Silver.AirImport.Trans/AirImpHouseEditPage', JSON.stringify(parameter));

  // }
  edit(_record: Tbl_cargo_imp_housem) {


    let parameter = {
      menuid: this.mainservice.menuid,
      pkid: _record.hbl_pkid,
      parentid :_record.hbl_mbl_id,
      type: '',
      origin: 'airimp-house-page',
      mode: 'EDIT'
    };
    this.gs.Naviagete('Silver.AirImport.Trans/AirImpHouseEditPage', JSON.stringify(parameter));
  }

  editmaster(_record: Tbl_cargo_imp_housem) {
    this.gs.LinkPage('REFNO', 'AIR IMPORT', _record.mbl_refno, _record.hbl_mbl_id,_record.hbl_pkid);
  }

  Close() {
    this.location.back();
  }

 
}
