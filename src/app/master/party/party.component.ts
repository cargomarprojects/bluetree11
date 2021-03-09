import { Component, OnInit, Input, OnDestroy, SimpleChange } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { GlobalService } from '../../core/services/global.service';
import { vm_Tbl_Mast_Partym, Tbl_Mast_Partym } from '../models/Tbl_Mast_Partym';
import { SearchQuery } from '../models/Tbl_Mast_Partym';
import { PageQuery } from '../../shared/models/pageQuery';

import { PartyService } from '../services/party.service';

@Component({
  selector: 'app-party',
  templateUrl: './party.component.html'
})
export class PartyComponent implements OnInit {

  /*
 01-07-2019 Created By Ajith  

*/
  sub: any;

  errorMessage$: Observable<string>;
  records$: Observable<Tbl_Mast_Partym[]>;
  pageQuery$: Observable<PageQuery>;
  searchQuery$: Observable<SearchQuery>;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    public gs: GlobalService,
    public mainservice: PartyService
  ) { }

  ngOnInit() {
  //  this.mainservice.init(this.route.snapshot.queryParams);
    this.sub = this.route.queryParams.subscribe(params => {
      if (params["parameter"] != "") {
        this.mainservice.init(params);
        // this.mainservice.Search('SCREEN');
      }
    });
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

  NewRecord() {
    if (!this.mainservice.canAdd) {
      alert('Insufficient User Rights')
      return;
    }

    let parameter = {
      menuid: this.mainservice.menuid,
      pkid: '',
      type: this.mainservice.param_type,
      origin: 'partymaster-page',
      mode: 'ADD'
    };

    if (this.mainservice.param_type === "PARTYS")
      this.gs.Naviagete('Silver.Master/PartyEditPage', JSON.stringify(parameter));
    else
      this.gs.Naviagete('Silver.Master/PartyParentEditPage', JSON.stringify(parameter));
  }
  edit(_record: Tbl_Mast_Partym) {
    if (!this.mainservice.canEdit) {
      alert('Insufficient User Rights')
      return;
    }

    let parameter = {
      menuid: this.mainservice.menuid,
      pkid: _record.gen_pkid,
      type: this.mainservice.param_type,
      origin: 'partymaster-page',
      mode: 'EDIT'
    };

    if (this.mainservice.param_type === "PARTYS")
      this.gs.Naviagete('Silver.Master/PartyEditPage', JSON.stringify(parameter));
    else
      this.gs.Naviagete('Silver.Master/PartyParentEditPage', JSON.stringify(parameter));
  }

  Close() {
    this.location.back();
  }

  ngOnDestroy() {
     this.sub.unsubscribe();
  }

}
