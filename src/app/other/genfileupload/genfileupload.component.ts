import { Component, OnInit, Input, OnDestroy, SimpleChange } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { GlobalService } from '../../core/services/global.service';
import { SearchQuery, Tbl_cargo_genfilesModel , Tbl_cargo_genfiles } from '../models/Tbl_cargo_genfiles';
import { PageQuery } from '../../shared/models/pageQuery';
import { GenFileUploadService } from '../services/genfileupload.service';

@Component({
  selector: 'app-genfileupload',
  templateUrl: './genfileupload.component.html'
})
export class GenFileUploadComponent implements OnInit {

  /*
   Joy
 */

  errorMessage$: Observable<string>;
  records$: Observable<Tbl_cargo_genfiles []>;
  pageQuery$: Observable<PageQuery>;
  searchQuery$: Observable<SearchQuery>;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    public gs: GlobalService,
    public mainservice: GenFileUploadService
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

  NewRecord() {
    if (!this.mainservice.canAdd) {
      alert('Insufficient User Rights')
      return;
    }

    let parameter = {
      menuid: this.mainservice.menuid,
      pkid: '',
      type: this.mainservice.param_type,
      origin: 'genfileupload-page',
      mode: 'ADD'
    };
    this.gs.Naviagete('Silver.Other.Trans/GeneralFileUploadEditPage', JSON.stringify(parameter));

  }
  edit(_record: Tbl_cargo_genfiles) {
    if (!this.mainservice.canEdit) {
      alert('Insufficient User Rights')
      return;
    }

    let parameter = {
      menuid: this.mainservice.menuid,
      pkid: _record.gf_pkid ,
      type: '',
      origin: 'genfileupload-page',
      mode: 'EDIT'
    };
    this.gs.Naviagete('Silver.Other.Trans/GeneralFileUploadEditPage', JSON.stringify(parameter));
  }

  Close() {    
    this.location.back();
  }


}
