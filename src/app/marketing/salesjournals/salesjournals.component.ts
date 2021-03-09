import { Component, OnInit, Input, OnDestroy, SimpleChange } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { GlobalService } from '../../core/services/global.service';
import { Tbl_Cargo_Journals_Master } from '../models/tbl_cargo_journals_master';
import { SearchQuery } from '../models/tbl_cargo_journals_master';
import { PageQuery } from '../../shared/models/pageQuery';
import { SalesJournalService } from '../services/salesjournals.service';

@Component({
  selector: 'app-salesjournals',
  templateUrl: './salesjournals.component.html'
})
export class SalesJournalsComponent implements OnInit {

  // 02-07-2019 Created By Ajith  

  errorMessage$: Observable<string>;
  records$: Observable<Tbl_Cargo_Journals_Master[]>;
  pageQuery$: Observable<PageQuery>;
  searchQuery$: Observable<SearchQuery>;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    public gs: GlobalService,
    public mainservice: SalesJournalService
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
      custid:'',
      origin: 'salesjournals-page',
      mode: 'ADD'
    };
    this.gs.Naviagete('Silver.Marketing.Master/SalesJournalsEditPage', JSON.stringify(parameter));

  }
  edit(_record: Tbl_Cargo_Journals_Master) {

    // if (_record.qtnr_slno == null || _record.qtnr_slno.toString().trim() == "") {
    //   alert('Cannot View/Edit This Row')
    //   return;
    // }

    if (!this.mainservice.canEdit) {
      alert('Insufficient User Rights')
      return;
    }

    let parameter = {
      menuid: this.mainservice.menuid,
      pkid: _record.cjm_pkid,
      custid: _record.cjm_customer_id,
      origin: 'salesjournals-page',
      mode: 'EDIT'
    };
    this.gs.Naviagete('Silver.Marketing.Master/SalesJournalsEditPage', JSON.stringify(parameter));
  }

  Close() {
    this.location.back();
  }

  ShowMemo(_rec: Tbl_Cargo_Journals_Master) {
    let prm = {
      menuid: this.mainservice.menuid,
      pkid: _rec.cjm_pkid,
      source: 'CONTACT-MEMO',
      title: 'Memo',
      origin: 'salesjournals-page'
    };
    this.gs.Naviagete('Silver.BusinessModule/XmlRemarksPage', JSON.stringify(prm));
     
  }

  Downloadfile(filename: string, filetype: string, filedisplayname: string) {
    this.gs.DownloadFile(this.gs.FS_APP_FOLDER, filename, filetype, filedisplayname);
  }


}
