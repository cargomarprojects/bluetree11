
import { Component, OnInit, Input, OnDestroy, SimpleChange } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { GlobalService } from '../../core/services/global.service';
import { Tbl_cargo_exp_masterm } from '../models/tbl_cargo_exp_masterm';
import { SearchQuery } from '../models/tbl_cargo_exp_masterm';
import { PageQuery } from '../../shared/models/pageQuery';

import { seaexpMasterService } from '../services/seaexp-master.service';



@Component({
  selector: 'app-seaexp-master',
  templateUrl: './seaexp-master.component.html'
})
export class SeaexpMasterComponent implements OnInit {

  // 24-05-2019 Created By Joy  


  errorMessage$: Observable<string>;
  records$: Observable<Tbl_cargo_exp_masterm[]>;
  pageQuery$: Observable<PageQuery>;
  searchQuery$: Observable<SearchQuery>;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    public gs: GlobalService,
    public mainservice: seaexpMasterService
  ) {

  }

  rowclick($event){
    console.log($event);
  }

  ngOnInit() {
    console.log('ngOnInit SEXPM', this.route.snapshot.queryParams);
    console.log('ngOnInit SEXPM SETTINGS', this.gs.MainList.length);
    console.log('ngOnInit SEXPM MENULIST', this.gs.MenuList.length);
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


  getLink(_mode: string) {
    if ((_mode == "ADD" && this.mainservice.canAdd) || (_mode == "EDIT" && this.mainservice.canEdit))
      return "/Silver.SeaExport.Trans/SeaExpMasterEditPage";
    else
      return null;
  }

  getParam(_record: Tbl_cargo_exp_masterm = null) {
    if (_record == null) {
      if (!this.mainservice.canAdd)
        return null;
      return {
        appid: this.gs.appid,
        menuid: this.mainservice.menuid,
        pkid: '',
        type: this.mainservice.param_type,
        origin: 'seaexp-master-page',
        mode: 'ADD'
      };
    }
    if (!this.mainservice.canEdit)
      return null;
    return {
      appid: this.gs.appid,
      menuid: this.mainservice.menuid,
      pkid: _record.mbl_pkid,
      type: '',
      origin: 'seaexp-master-page',
      mode: 'EDIT'
    };
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
      origin: 'seaexp-master-page',
      mode: 'ADD'
    };
    this.router.navigate(['Silver.SeaExport.Trans/SeaExpMasterEditPage'], { queryParams: { menuid: this.mainservice.menuid, pkid: '', type: this.mainservice.param_type, origin: 'seaexp-master-page', mode: 'ADD' } });
  }
  edit(_record: Tbl_cargo_exp_masterm) {
    if (!this.mainservice.canEdit) {
      alert('Insufficient User Rights')
      return;
    }
    let parameter = {
      menuid: this.mainservice.menuid,
      pkid: _record.mbl_pkid,
      type: '',
      origin: 'seaexp-master-page',
      mode: 'EDIT'
    };
    this.gs.Naviagete('Silver.SeaExport.Trans/SeaExpMasterEditPage', JSON.stringify(parameter));
  }

  Close() {
    this.location.back();
  }

}

