
import { Component, OnInit, Input, OnDestroy, SimpleChange } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { GlobalService } from '../../core/services/global.service';
import { Tbl_cargo_imp_housem } from '../models/tbl_cargo_imp_housem';
import { SearchQuery } from '../models/tbl_cargo_imp_housem';
import { PageQuery } from '../../shared/models/pageQuery';

import { SeaImpHouseService } from '../services/seaimp-house.service';

@Component({
  selector: 'app-seaimp-house',
  templateUrl: './seaimp-house.component.html'
})
export class SeaImpHouseComponent implements OnInit {

  // 02-07-2019 Created By Ajith  


  errorMessage$: Observable<string>;
  records$: Observable<Tbl_cargo_imp_housem[]>;
  pageQuery$: Observable<PageQuery>;
  searchQuery$: Observable<SearchQuery>;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    public gs: GlobalService,
    public mainservice: SeaImpHouseService
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


  //   let parameter = {
  //     menuid: this.mainservice.menuid,
  //     pkid: '',
  //     parentid :'',
  //     type: this.mainservice.param_type,
  //     origin: 'seaimp-house-page',
  //     mode: 'ADD'
  //   };
  //   this.gs.Naviagete('Silver.SeaImport/SeaImpHouseEditPage', JSON.stringify(parameter));

  // }
  edit(_record: Tbl_cargo_imp_housem) {

    if (!this.gs.canEdit(this.gs.MENU_SI_HOUSE)) {
      alert('Insufficient User Rights')
      return;
    }
    
    let parameter = {
      menuid: this.mainservice.menuid,
      pkid: _record.hbl_pkid,
      parentid: _record.hbl_mbl_id,
      type: '',
      origin: 'seaimp-house-page',
      mode: 'EDIT'
    };
    this.gs.Naviagete('Silver.SeaImport/SeaImpHouseEditPage', JSON.stringify(parameter));
  }

  editmaster(_record: Tbl_cargo_imp_housem) {
    
    
    this.gs.LinkPage("REFNO", "SEA IMPORT", _record.mbl_refno, _record.hbl_mbl_id, _record.hbl_pkid, "");
  }

  Close() {
    this.location.back();
  }


}
